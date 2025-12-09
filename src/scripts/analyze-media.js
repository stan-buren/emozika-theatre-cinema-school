import { db } from './db.js';

// 1. Analyze Albums (Distinct IDs from photos)
const albumIds = db.prepare('SELECT DISTINCT album_id FROM photos').all();
console.log(`\n📸 Found ${albumIds.length} albums referenced in photos.`);
// Note: We don't have album titles stored in DB yet! We only have them during sync.
// We can check the captions, maybe the sync script put album title in caption?
const samplePhotos = db.prepare('SELECT album_id, caption FROM photos GROUP BY album_id LIMIT 10').all();
samplePhotos.forEach(p => console.log(`   Album ${p.album_id}: "${p.caption}"`));


// 2. Analyze Videos (from raw_json in posts)
const videoPosts = db.prepare("SELECT raw_json FROM posts WHERE video_urls != '[]' LIMIT 5").all();
console.log(`\n🎥 Video Meta Sample:`);
videoPosts.forEach((p, i) => {
    try {
        const json = JSON.parse(p.raw_json);
        const videos = json.attachments?.filter(a => a.type === 'video').map(a => a.video);
        videos.forEach(v => {
            console.log(`   [${i}] "${v.title}" (Duration: ${v.duration}s)`);
        });
    } catch (e) { console.log('Error parsing JSON'); }
});
