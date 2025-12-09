import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'src', 'db', 'vk_cache.db');
const DB_DIR = path.dirname(DB_PATH);

// Ensure dir exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
// db.pragma('journal_mode = WAL'); // Optional for performance

// Initialize Schema Immediately
console.log('📦 Initializing Database Schema...');

// Posts Table
db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY, -- VK Post ID
        owner_id INTEGER,
        date INTEGER,
        text TEXT,
        image_urls TEXT, -- JSON array of strings
        video_urls TEXT, -- JSON array of strings
        raw_json TEXT,
        is_hidden BOOLEAN DEFAULT 0,
        tags TEXT -- JSON array or comma separated
    );
`);

// Photos Table (Gallery)
db.exec(`
    CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY, -- VK Photo ID
        owner_id INTEGER,
        album_id INTEGER,
        url TEXT,
        caption TEXT,
        date INTEGER,
        width INTEGER,
        height INTEGER
    );
`);

// Topics Table (Discussions)
db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY, -- VK Topic ID
        title TEXT,
        created INTEGER,
        updated INTEGER,
        comments_count INTEGER,
        is_closed BOOLEAN
    );
`);

// Comments Table (for specific topics)
db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY, -- VK Comment ID
        topic_id INTEGER,
        owner_id INTEGER,
        date INTEGER,
        text TEXT,
        attachments TEXT -- JSON
    );
`);

console.log('✅ Database schema ready.');

// Prepare Statements for Performance
const insertPost = db.prepare(`
    INSERT INTO posts (id, owner_id, date, text, image_urls, video_urls, raw_json, tags)
    VALUES (@id, @owner_id, @date, @text, @image_urls, @video_urls, @raw_json, @tags)
    ON CONFLICT(id) DO UPDATE SET
        text = excluded.text,
        image_urls = excluded.image_urls,
        video_urls = excluded.video_urls,
        raw_json = excluded.raw_json,
        tags = excluded.tags;
`);

const insertPhoto = db.prepare(`
    INSERT INTO photos (id, owner_id, album_id, url, caption, date, width, height)
    VALUES (@id, @owner_id, @album_id, @url, @caption, @date, @width, @height)
    ON CONFLICT(id) DO UPDATE SET
        url = excluded.url,
        caption = excluded.caption;
`);

const insertTopic = db.prepare(`
    INSERT INTO topics (id, title, created, updated, comments_count, is_closed)
    VALUES (@id, @title, @created, @updated, @comments_count, @is_closed)
    ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        updated = excluded.updated,
        comments_count = excluded.comments_count;
`);

const insertComment = db.prepare(`
    INSERT INTO comments (id, topic_id, owner_id, date, text, attachments)
    VALUES (@id, @topic_id, @owner_id, @date, @text, @attachments)
    ON CONFLICT(id) DO UPDATE SET
        text = excluded.text,
        attachments = excluded.attachments;
`);

export { db, insertPost, insertPhoto, insertTopic, insertComment };
