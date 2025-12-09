import fs from 'fs/promises';
import path from 'path';
import { insertPost, insertPhoto, insertTopic, insertComment, db } from './db.js';

// Configuration
const TOKEN = process.env.VK_SERVICE_TOKEN;
const GROUP_ID = process.env.VK_GROUP_ID;
const API_VERSION = '5.199';

const GROUP_ID_NUM = Math.abs(Number(GROUP_ID));
const OWNER_ID = -GROUP_ID_NUM;

// Delay helper to avoid rate-limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log('🔄 Starting VK -> DB Sync (Full History)...');

    if (!TOKEN || !GROUP_ID) {
        console.error('❌ Error: VK_SERVICE_TOKEN or VK_GROUP_ID not found.');
        process.exit(1);
    }

    try {
        // initDB(); // executed on import

        // 1. Photos
        await fetchAndSavePhotos();

        // 2. Posts (Wall) - Full History
        await fetchAndSavePosts();

        // 3. Discussions (Topics)
        await fetchAndSaveTopics();

        console.log('✨ VK Content Sync (DB) completed successfully!');
    } catch (error) {
        console.error('❌ Error during sync:', error);
        process.exit(1);
    }
}

async function vkRequest(method, params = {}) {
    const searchParams = new URLSearchParams({
        access_token: TOKEN,
        v: API_VERSION,
        ...params
    });

    const url = `https://api.vk.com/method/${method}`;

    try {
        const response = await fetch(`${url}?${searchParams.toString()}`);
        const data = await response.json();

        if (data.error) {
            console.error(`VK API Error ${data.error.error_code}: ${data.error.error_msg}`);
            // Simple retry logic for "Too many requests"
            if (data.error.error_code === 6) {
                console.log('   ⏳ Rate limit hit, waiting 1s...');
                await sleep(1000);
                return vkRequest(method, params);
            }
            return null;
        }
        return data.response;
    } catch (e) {
        console.error(`Failed to fetch ${method}:`, e.message);
        return null;
    }
}

async function fetchAndSavePhotos() {
    console.log('📸 Fetching photos...');
    // Fetch albums first
    const albums = await vkRequest('photos.getAlbums', {
        owner_id: OWNER_ID,
        need_covers: 1,
        count: 10 // Increased album fetch count
    });

    if (!albums || !albums.items) return;

    let totalPhotos = 0;

    for (const album of albums.items) {
        // Fetch photos for each album
        const photos = await vkRequest('photos.get', {
            owner_id: OWNER_ID,
            album_id: album.id,
            count: 50, // Fetch more history per album
            photo_sizes: 1
        });

        if (photos && photos.items) {
            const insertTx = db.transaction((items) => {
                for (const p of items) {
                    const bestUrl = getBestPhotoUrl(p.sizes);
                    insertPhoto.run({
                        id: p.id,
                        owner_id: p.owner_id,
                        album_id: p.album_id,
                        url: bestUrl,
                        caption: p.text || album.title,
                        date: p.date,
                        width: 0,
                        height: 0
                    });
                }
            });

            insertTx(photos.items);
            totalPhotos += photos.items.length;
            console.log(`   Saved ${photos.items.length} photos from album "${album.title}"`);
        }
        await sleep(350); // Delay between albums
    }
    console.log(`   ✅ Total photos synced: ${totalPhotos}`);
}

async function fetchAndSavePosts() {
    console.log('📝 Fetching posts (wall)...');

    // 1. Get total count
    const initialData = await vkRequest('wall.get', {
        owner_id: OWNER_ID,
        count: 1,
        offset: 0
    });

    if (!initialData) return;

    const totalCount = initialData.count;
    console.log(`   📊 Total posts found: ${totalCount}`);

    const BATCH_SIZE = 100;
    let processed = 0;

    // Loop through all posts
    for (let offset = 0; offset < totalCount; offset += BATCH_SIZE) {
        console.log(`   ⬇️ Fetching batch ${offset} - ${offset + BATCH_SIZE}...`);

        const data = await vkRequest('wall.get', {
            owner_id: OWNER_ID,
            count: BATCH_SIZE,
            offset: offset,
            extended: 1
        });

        if (!data || !data.items || data.items.length === 0) break;

        const insertTx = db.transaction((posts) => {
            for (const post of posts) {

                // Extract Attachments
                const imageUrls = [];
                const videoUrls = [];

                if (post.attachments) {
                    post.attachments.forEach(att => {
                        if (att.type === 'photo') {
                            imageUrls.push(getBestPhotoUrl(att.photo.sizes));
                        } else if (att.type === 'video') {
                            if (att.video.player) {
                                videoUrls.push(att.video.player);
                            } else {
                                videoUrls.push(`https://vk.com/video${att.video.owner_id}_${att.video.id}`);
                            }
                        }
                    });
                }

                // Heuristic Tags
                const tags = [];
                const textLower = (post.text || '').toLowerCase();
                if (textLower.includes('#награда') || textLower.includes('диплом') || textLower.includes('лауреат') || textLower.includes('гран-при')) tags.push('award');
                if (textLower.includes('спектакль') || textLower.includes('афиша')) tags.push('play');

                insertPost.run({
                    id: post.id,
                    owner_id: post.owner_id,
                    date: post.date,
                    text: post.text || '',
                    image_urls: JSON.stringify(imageUrls),
                    video_urls: JSON.stringify(videoUrls),
                    raw_json: JSON.stringify(post),
                    tags: tags.join(',')
                });
            }
        });

        insertTx(data.items);
        processed += data.items.length;

        // Polite delay
        await sleep(350);
    }

    console.log(`   ✅ Saved ${processed} posts to DB.`);
}

async function fetchAndSaveTopics() {
    console.log('🗣️  Fetching discussions (topics)...');

    const data = await vkRequest('board.getTopics', {
        group_id: GROUP_ID_NUM,
        count: 100, // Should cover all topics
        preview: 1
    });

    if (!data || !data.items) return;

    const topics = data.items;

    // Save Topics
    const insertTx = db.transaction((items) => {
        for (const t of items) {
            insertTopic.run({
                id: t.id,
                title: t.title,
                created: t.created,
                updated: t.updated,
                comments_count: t.comments,
                is_closed: t.is_closed ? 1 : 0
            });
        }
    });
    insertTx(topics);
    console.log(`   Saved ${topics.length} topics.`);

    // Check for "Awards" or "Reviews" to fetch comments
    for (const topic of topics) {
        const titleLower = topic.title.toLowerCase();

        // Strategy: Fetch comments only for interesting topics to save time
        // "НАШИ НАГРАДЫ", "ОТЗЫВЫ", "Спектакли"
        if (titleLower.includes('наград') || titleLower.includes('диплом') || titleLower.includes('побед') || titleLower.includes('отзыв')) {
            console.log(`   💬 Fetching comments for topic: "${topic.title}" (${topic.comments} comments)...`);
            await fetchComments(topic.id);
            await sleep(350);
        }
    }
}

async function fetchComments(topicId) {
    let offset = 0;
    const count = 100;
    let hasMore = true;
    let totalSynced = 0;

    while (hasMore) {
        const data = await vkRequest('board.getComments', {
            group_id: GROUP_ID_NUM,
            topic_id: topicId,
            count: count,
            offset: offset,
            extended: 1 // Need attachments
        });

        if (!data || !data.items || data.items.length === 0) {
            hasMore = false;
            break;
        }

        const insertTx = db.transaction((comments) => {
            for (const c of comments) {
                // Parse attachments for images
                const attachments = [];
                if (c.attachments) {
                    c.attachments.forEach(att => {
                        if (att.type === 'photo') {
                            attachments.push({
                                type: 'photo',
                                url: getBestPhotoUrl(att.photo.sizes),
                                text: att.photo.text
                            });
                        }
                    });
                }

                insertComment.run({
                    id: c.id,
                    topic_id: topicId,
                    owner_id: c.from_id,
                    date: c.date,
                    text: c.text || '',
                    attachments: JSON.stringify(attachments)
                });
            }
        });

        insertTx(data.items);
        totalSynced += data.items.length;
        offset += count;

        if (offset >= data.count) {
            hasMore = false;
        }
        await sleep(200);
    }
    console.log(`      ✅ Scraped ${totalSynced} comments.`);
}

function getBestPhotoUrl(sizes) {
    if (!sizes || !Array.isArray(sizes)) return null;
    const typePriority = { 'w': 10, 'z': 9, 'y': 8, 'x': 7, 'm': 5, 's': 1 };
    const sorted = sizes.sort((a, b) => {
        const pA = typePriority[a.type] || 0;
        const pB = typePriority[b.type] || 0;
        return pB - pA;
    });
    return sorted[0]?.url;
}

main();
