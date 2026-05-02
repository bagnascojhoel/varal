import { After, Before, setWorldConstructor } from '@cucumber/cucumber';
import fs from 'fs';
import path from 'path';
import { TestWorld } from './world';

// Load environment variables from .env.local
const envLocalPath = path.join(__dirname, '../../.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key) {
        process.env[key] = value;
      }
    }
  });
}

// Ensure the prisma directory exists and convert DATABASE_URL to absolute path
const prismaDir = path.join(__dirname, '../../prisma');
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
}

// Convert relative DATABASE_URL to absolute path
if (process.env.DATABASE_URL) {
  if (process.env.DATABASE_URL.startsWith('file:')) {
    let dbPath = process.env.DATABASE_URL.replace('file:', '').replace(
      /["']/g,
      '',
    );

    // Convert relative path to absolute
    if (!path.isAbsolute(dbPath)) {
      dbPath = path.join(__dirname, '../../', dbPath);
    }

    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Update environment variable with absolute path
    process.env.DATABASE_URL = `file:${dbPath}`;
  }
}

setWorldConstructor(TestWorld);

Before(function (this: TestWorld) {
  this.setupContainer();
});

After(function (this: TestWorld) {
  this.reset();
});
