import { db } from './db.js';

const posts = db.prepare("SELECT raw_json FROM posts WHERE video_urls != '[]' LIMIT 20").all();

console.log('--- Video Analysis ---');
posts.forEach(p => {
    try {
        const json = JSON.parse(p.raw_json);
        const atts = json.attachments || [];
        atts.forEach(a => {
            if (a.type === 'video') {
                const v = a.video;
                console.log(`Type: ${v.type} | Duration: ${v.duration}s | Title: "${v.title}" | Description: "${v.description?.substring(0, 50)}..."`);
            }
        });
    } catch (e) { }
});
