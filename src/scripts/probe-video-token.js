import { db } from './db.js';
import fs from 'fs/promises';

// Configuration
const TOKEN = process.env.VK_SERVICE_TOKEN;
const GROUP_ID = -58293658;
const API_VERSION = '5.199';

async function vkRequest(method, params = {}) {
    const searchParams = new URLSearchParams({
        access_token: TOKEN,
        v: API_VERSION,
        ...params
    });
    try {
        const response = await fetch(`https://api.vk.com/method/${method}?${searchParams.toString()}`);
        const data = await response.json();
        return data.response;
    } catch (e) { return null; }
}

async function analyzeVideos() {
    console.log('🎥 Probing Video API with User Token...');

    // 1. Get Video Albums? 
    const albums = await vkRequest('video.getAlbums', {
        owner_id: GROUP_ID,
        count: 5
    });

    console.log('\n📁 Video Albums:');
    if (albums && albums.items) {
        albums.items.forEach(a => console.log(`   - [${a.id}] ${a.title} (${a.count} videos)`));
    } else {
        console.log('   (No albums found or access denied)');
    }

    // 2. Get Videos directly
    const videos = await vkRequest('video.get', {
        owner_id: GROUP_ID,
        count: 10
    });

    console.log('\n🎞 Recent Videos:');
    if (videos && videos.items) {
        videos.items.forEach(v => {
            console.log(`   - [${v.id}] ${v.title} (${v.duration}s) [Type: ${v.type}]`);
        });
    }
}

analyzeVideos();
