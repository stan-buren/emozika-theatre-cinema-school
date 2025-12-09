import fs from 'fs/promises';
import path from 'path';
import { insertPost, insertPhoto, insertTopic, insertComment, insertVideo, db } from './db.js';

// Configuration
const SERVICE_TOKEN = process.env.VK_SERVICE_TOKEN;
const USER_TOKEN = process.env.VK_USER_TOKEN;
const GROUP_ID = process.env.VK_GROUP_ID;
const API_VERSION = '5.199';

const GROUP_ID_NUM = Math.abs(Number(GROUP_ID));
const OWNER_ID = -GROUP_ID_NUM;

// Delay helper to avoid rate-limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log('🔄 Starting VK -> DB Sync (Full History)...');

    if (!SERVICE_TOKEN || !GROUP_ID) {
        console.error('❌ Error: VK_SERVICE_TOKEN or VK_GROUP_ID not found.');
        process.exit(1);
    }

    if (USER_TOKEN) {
        console.log('   🔑 VK_USER_TOKEN found. Using it for videos and advanced access.');
    } else {
        console.log('   ℹ️  No VK_USER_TOKEN found. Some videos might be restricted.');
    }

    try {
        // initDB(); // executed on import

        // 1. Photos
        await fetchAndSavePhotos();

        // 2. Posts (Wall) - Full History
        await fetchAndSavePosts();

        // 3. Discussions (Topics)
        await fetchAndSaveTopics();

        // 4. Videos (Requires User Token for best results)
        await fetchAndSaveVideos();

        console.log('✨ VK Content Sync (DB) completed successfully!');
    } catch (error) {
        console.error('❌ Error during sync:', error);
        process.exit(1);
    }
}

async function vkRequest(method, params = {}) {
    // Choose token: User token for videos/users related, Service token for public group data
    let token = SERVICE_TOKEN;
    if (method.startsWith('video.') && USER_TOKEN) {
        token = USER_TOKEN;
    }

    const searchParams = new URLSearchParams({
        access_token: token,
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
    console.log('📸 Fetching photos (Full Album Scan)...');

    // 1. Fetch ALL Albums
    let allAlbums = [];
    let offset = 0;
    let hasMoreAlbums = true;

    console.log('   📂 reading album list...');
    while (hasMoreAlbums) {
        const albumsData = await vkRequest('photos.getAlbums', {
            owner_id: OWNER_ID,
            need_covers: 1,
            count: 20,
            offset: offset
        });

        if (albumsData && albumsData.items && albumsData.items.length > 0) {
            allAlbums.push(...albumsData.items);
            offset += 20;
            if (offset >= albumsData.count) hasMoreAlbums = false;
        } else {
            hasMoreAlbums = false;
        }
        await sleep(200);
    }
    console.log(`   📂 Found ${allAlbums.length} albums. Starting sync...`);

    let totalPhotosSynced = 0;

    // 2. Process Each Album
    for (const album of allAlbums) {
        console.log(`   📂 [${album.title}] (${album.size} photos)`);

        let photoOffset = 0;
        let hasMorePhotos = true;

        while (hasMorePhotos) {
            const photos = await vkRequest('photos.get', {
                owner_id: OWNER_ID,
                album_id: album.id,
                count: 50, // Max 50 usually
                offset: photoOffset,
                photo_sizes: 1
            });

            if (photos && photos.items && photos.items.length > 0) {
                const insertTx = db.transaction((items) => {
                    for (const p of items) {
                        const bestUrl = getBestPhotoUrl(p.sizes);
                        insertPhoto.run({
                            id: p.id,
                            owner_id: p.owner_id,
                            album_id: p.album_id,
                            album_title: album.title, // [NEW]
                            url: bestUrl,
                            caption: p.text || album.title,
                            date: p.date,
                            width: 0,
                            height: 0
                        });
                    }
                });

                insertTx(photos.items);
                totalPhotosSynced += photos.items.length;
                photoOffset += 50;

                if (photoOffset >= photos.count) hasMorePhotos = false;
                await sleep(200); // Gentle delay
            } else {
                hasMorePhotos = false;
            }
        }
    }
    console.log(`   ✅ Total photos synced: ${totalPhotosSynced}`);
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

async function fetchAndSaveVideos() {
    console.log('🎥 Fetching videos...');

    // Fetch all videos (up to 200, assume enough for now, or loop if needed)
    // We fetch ALL because "Films" album ID might change or we might want specific queries later
    const data = await vkRequest('video.get', {
        owner_id: OWNER_ID,
        count: 200,
        extended: 1 // IMPORTANT for privacy check and duration
    });

    if (!data || !data.items) return;

    const insertTx = db.transaction((items) => {
        for (const v of items) {
            // Extract best image
            const bestImage = getBestPhotoUrl(v.image);

            insertVideo.run({
                id: v.id,
                owner_id: v.owner_id,
                title: v.title,
                description: v.description || '',
                duration: v.duration,
                image_url: bestImage,
                player_url: v.player,
                album_ids: JSON.stringify(v.album_ids || []), // Some videos have no album
                date: v.date,
                type: v.type || 'video'
            });
        }
    });

    insertTx(data.items);
    console.log(`   ✅ Saved ${data.items.length} videos to DB.`);
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
