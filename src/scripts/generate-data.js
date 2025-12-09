import fs from 'fs/promises';
import path from 'path';
import { db } from './db.js';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

async function main() {
    console.log('🏭 Generating JSON data from DB...');

    await fs.mkdir(DATA_DIR, { recursive: true });

    // 1. Generate Gallery (Photos)
    generateGallery();

    // 2. Generate Films (Videos from Posts)
    generateFilms();

    // 3. Generate Awards (From Posts with #awards)
    generateAwards();

    // 4. Generate Goods (Placeholder from DB or just empty if no table yet)
    // We didn't solve market access yet, so generate empty or cache if we had it.
    await saveData('vk_goods.json', []);

    console.log('✨ Data generation complete!');
}

function generateGallery() {
    // Select recent photos
    const photos = db.prepare('SELECT * FROM photos ORDER BY date DESC LIMIT 50').all();

    const galleryItems = photos.map(p => ({
        id: `vk-${p.id}`,
        category: 'backstage', // default for now, can improve logic later
        categoryLabel: 'Закулисье',
        src: p.url,
        full: p.url,
        alt: p.caption || "Фото из ВКонтакте",
        caption: p.caption || ""
    }));

    saveData('vk_gallery.json', galleryItems);
}

function generateFilms() {
    // Select posts that have video_urls populated
    const posts = db.prepare("SELECT * FROM posts WHERE video_urls != '[]' ORDER BY date DESC LIMIT 20").all();

    const films = [];
    posts.forEach(post => {
        const videos = JSON.parse(post.video_urls);
        // Each post might have multiple videos, usually one
        videos.forEach((vUrl, idx) => {
            films.push({
                id: `vk-${post.id}-${idx}`,
                title: "Видео из VK", // We might want to parse title from raw_json if available
                year: new Date(post.date * 1000).getFullYear().toString(),
                city: "Санкт-Петербург",
                logline: post.text ? post.text.substring(0, 100) + '...' : '',
                synopsis: post.text || '',
                vkEmbedUrl: vUrl,
                vkPageUrl: `https://vk.com/wall${post.owner_id}_${post.id}`,
                awards: []
            });
        });
    });

    saveData('vk_films.json', films);
}

function generateAwards() {
    // 1. Find the "Awards" topic (Fetch all and filter in JS to avoid SQLite Cyrillic case issues)
    const allTopics = db.prepare("SELECT id, title FROM topics").all();
    const topic = allTopics.find(t => t.title.toLowerCase().includes('наград'));

    if (!topic) {
        console.log("   ⚠️ No 'Awards' topic found for generation.");
        saveData('vk_awards.json', []);
        return;
    }

    console.log(`   🏆 Using topic: "${topic.title}" (${topic.id})`);

    // 2. Get comments from that topic
    const comments = db.prepare("SELECT * FROM comments WHERE topic_id = ? ORDER BY date DESC").all(topic.id);

    const awards = [];

    comments.forEach(c => {
        // Parse attachments for photos
        let photoUrl = null;
        try {
            const atts = JSON.parse(c.attachments);
            const photo = atts.find(a => a.type === 'photo');
            if (photo) photoUrl = photo.url;
        } catch (e) { }

        // Only include if it has a photo (usually the diploma) or significant text
        if (photoUrl || c.text.length > 10) {
            awards.push({
                festivalId: `vk-topic-${c.id}`,
                label: "Награда", // We could try to extract year or festival name from text
                sublabel: c.text ? c.text.substring(0, 100) + (c.text.length > 100 ? '...' : '') : 'Диплом',
                image: photoUrl, // We might need to update schema/component to support images in awards list
                date: new Date(c.date * 1000).toISOString()
            });
        }
    });

    saveData('vk_awards.json', awards);
}

async function saveData(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`   ✅ Generated ${filename} (${data.length} items)`);
}

main();
