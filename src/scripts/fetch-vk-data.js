import fs from 'fs/promises';
import path from 'path';

// Configuration
const TOKEN = process.env.VK_SERVICE_TOKEN;
const GROUP_ID = process.env.VK_GROUP_ID; // Can be positive (ID) or just number
const API_VERSION = '5.199';

const GROUP_ID_NUM = Math.abs(Number(GROUP_ID));
const OWNER_ID = -GROUP_ID_NUM;

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

async function main() {
    console.log('🔄 Starting VK Content Sync...');

    if (!TOKEN || !GROUP_ID) {
        console.warn('⚠️  Warning: VK_SERVICE_TOKEN or VK_GROUP_ID missing.');
        console.warn('👉 using mock data for dry-run.');
        // We will continue to generate "mock" VK data files so the build doesn't break
        // if we switch imports.
        await generateMockData();
        return;
    }

    try {
        await fs.mkdir(DATA_DIR, { recursive: true });

        // 1. Photos (Albums -> Gallery schema)
        await fetchPhotos();

        // 2. Videos (Videos -> Films schema)
        await fetchVideos();

        // 3. Goods (Market -> Abonements schema placeholder)
        await fetchGoods();

        // 4. Posts (Wall -> Awards/News schema)
        await fetchPosts();

        console.log('✨ VK Content Sync completed successfully!');
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
            throw new Error(`VK API Error ${data.error.error_code}: ${data.error.error_msg}`);
        }
        return data.response;
    } catch (e) {
        console.error(`Failed to fetch ${method}:`, e.message);
        return null;
    }
}

async function generateMockData() {
    console.log('⚠️  Generating MOCK VK data... (Fill .env to get real data)');
    await saveData('vk_gallery.json', []);
    await saveData('vk_films.json', []);
    await saveData('vk_goods.json', []);
    await saveData('vk_posts.json', []);
}

async function fetchPhotos() {
    console.log('📸 Fetching photos...');
    // We want to map albums to our gallery schema:
    // { id, category, categoryLabel, src, full, alt, caption }

    // Strategy: Fetch specifically named albums or just mapping everything to "Backstage" or something.
    // For now, let's just fetch recent photos from the wall or main album.
    // Actually, getting albums is better.

    const albums = await vkRequest('photos.getAlbums', {
        owner_id: OWNER_ID,
        need_covers: 1,
        count: 5
    });

    const galleryItems = [];

    if (albums && albums.items) {
        for (const album of albums.items) {
            // Check if album title matches our categories?
            // "Сцена", "Репетиции", "Закулисье"
            // Default to "backstage"
            let category = 'backstage';
            let categoryLabel = 'Закулисье';

            const titleLower = album.title.toLowerCase();
            if (titleLower.includes('сцена') || titleLower.includes('спектакль')) {
                category = 'stage';
                categoryLabel = 'Сцена';
            } else if (titleLower.includes('репетиц')) {
                category = 'rehearsal';
                categoryLabel = 'Репетиции';
            }

            // Fetch a few photos from this album
            const photos = await vkRequest('photos.get', {
                owner_id: OWNER_ID,
                album_id: album.id,
                count: 5,
                photo_sizes: 1
            });

            if (photos && photos.items) {
                photos.items.forEach(p => {
                    const bestUrl = getBestPhotoUrl(p.sizes);
                    galleryItems.push({
                        id: `vk-${p.id}`,
                        category: category,
                        categoryLabel: categoryLabel,
                        src: bestUrl,
                        full: bestUrl, // Lightbox usually uses full
                        alt: p.text || album.title,
                        caption: p.text || album.title
                    });
                });
            }
        }
    }

    await saveData('vk_gallery.json', galleryItems);
}

async function fetchVideos() {
    console.log('🎥 Fetching videos...');
    // Schema: { id, title, year, city, logline, synopsis, ... vkEmbedUrl, vkPageUrl ... }
    const data = await vkRequest('video.get', {
        owner_id: OWNER_ID,
        count: 10
    });

    const videos = [];
    if (data && data.items) {
        videos.push(...data.items.map(v => ({
            id: `vk-${v.id}`,
            title: v.title,
            year: new Date(v.date * 1000).getFullYear().toString(),
            city: "Санкт-Петербург", // Default
            logline: v.description ? v.description.substring(0, 100) + '...' : '',
            synopsis: v.description || '',
            writer: "",
            directors: [],
            editor: "",
            dop: "",
            vkEmbedUrl: v.player, // Ensure this is the embed url
            vkPageUrl: `https://vk.com/video${OWNER_ID}_${v.id}`,
            awards: []
        })));
    }
    await saveData('vk_films.json', videos);
}

async function fetchGoods() {
    console.log('🛍️ Fetching goods (market)...');
    // Schema: { id, name, price, ... }
    const data = await vkRequest('market.get', {
        owner_id: OWNER_ID,
        count: 20,
        extended: 1
    });

    const goods = [];
    if (data && data.items) {
        goods.push(...data.items.map(item => ({
            id: `vk-${item.id}`,
            name: item.title,
            tagLine: "VK Товар",
            age: "",
            description: item.description,
            price: item.price?.text,
            isHero: false,
            highlight: false,
            bullets: [],
            note: "Загружено из ВКонтакте"
        })));
    }
    await saveData('vk_goods.json', goods);
}

async function fetchPosts() {
    console.log('📝 Fetching posts (wall)...');

    // Fetch 100 posts to see what we have
    const data = await vkRequest('wall.get', {
        owner_id: OWNER_ID,
        count: 100, // Maximim allowed per request
        extended: 1  // Get profiles and groups info too
    });

    const awards = [];

    if (data && data.items) {
        // 1. Save RAW dump for analysis (User requested)
        await saveData('vk_wall_dump.json', data);

        // 2. Process for Awards (keep existing logic for compatibility)
        data.items.forEach(post => {
            // Heuristic for awards
            if (post.text && (post.text.toLowerCase().includes('#награда') || post.text.toLowerCase().includes('диплом'))) {
                awards.push({
                    festivalId: `vk-${post.id}`,
                    label: "Награда из VK",
                    sublabel: post.text.substring(0, 50) + '...'
                });
            }
        });
    }
    await saveData('vk_awards.json', awards);
}

function getBestPhotoUrl(sizes) {
    if (!sizes || !Array.isArray(sizes)) return null;
    // Sort by type: w, z, y, x... or just by width
    // priority: w > z > y > x > m > s
    const typePriority = { 'w': 10, 'z': 9, 'y': 8, 'x': 7, 'm': 5, 's': 1 };

    const sorted = sizes.sort((a, b) => {
        const pA = typePriority[a.type] || 0;
        const pB = typePriority[b.type] || 0;
        return pB - pA;
    });

    return sorted[0]?.url;
}

async function saveData(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`   ✅ Saved ${data.length} items to ${filename}`);
}

main();
