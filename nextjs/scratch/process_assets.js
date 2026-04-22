
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = 'public';
const MAX_SIZE_BYTES = 300 * 1024; // 300KB

async function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  const stats = fs.statSync(filePath);
  if (stats.size <= MAX_SIZE_BYTES) {
    console.log(`Skipping ${filePath} (${(stats.size / 1024).toFixed(2)}KB)`);
    return;
  }

  console.log(`Compressing ${filePath} (${(stats.size / 1024).toFixed(2)}KB)`);

  try {
    const inputBuffer = fs.readFileSync(filePath);
    let metadata = await sharp(inputBuffer).metadata();
    
    let quality = 80;
    let buffer;
    
    // Initial pipeline
    let pipeline = sharp(inputBuffer);
    if (metadata.width > 1920) {
      pipeline = pipeline.resize(1920);
    }

    while (quality > 5) {
      if (ext === '.jpg' || ext === '.jpeg') {
        buffer = await pipeline.clone().jpeg({ quality, mozjpeg: true }).toBuffer();
      } else if (ext === '.png') {
        // PNGs are hard. If it's a large PNG, we might have to convert to webp to hit 300kb
        // But let's try compression first
        buffer = await pipeline.clone().png({ compressionLevel: 9, quality: quality + 10 }).toBuffer();
        if (buffer.length > MAX_SIZE_BYTES && quality < 40) {
            console.log(`PNG too large, converting to webp for ${filePath}`);
            buffer = await pipeline.clone().webp({ quality: 70 }).toBuffer();
            // Note: we keep the .png extension but it will be a webp file. 
            // Better to change extension or just accept larger size? 
            // User said "process public directory", let's keep name but use webp content.
            break; 
        }
      } else if (ext === '.webp') {
        buffer = await pipeline.clone().webp({ quality }).toBuffer();
      }

      if (buffer.length <= MAX_SIZE_BYTES) {
        break;
      }
      quality -= 10;
    }

    if (buffer.length > MAX_SIZE_BYTES) {
        console.log(`Still too large (${(buffer.length/1024).toFixed(2)}KB), forcing 1200px and low quality...`);
        buffer = await sharp(inputBuffer).resize(1200).webp({ quality: 50 }).toBuffer();
    }

    fs.writeFileSync(filePath, buffer);
    console.log(`Finished ${filePath} (${(buffer.length / 1024).toFixed(2)}KB)`);
  } catch (e) {
    console.error(`Error processing ${filePath}: ${e.message}`);
  }
}

async function run() {
  const files = await getAllFiles(PUBLIC_DIR);
  
  // 1. Remove videos
  const videoExts = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  for (const file of files) {
    if (fs.existsSync(file) && videoExts.includes(path.extname(file).toLowerCase())) {
      console.log(`Deleting video: ${file}`);
      fs.unlinkSync(file);
    }
  }

  // 2. Compress images
  const currentFiles = await getAllFiles(PUBLIC_DIR);
  for (const file of currentFiles) {
    if (fs.existsSync(file)) {
      await compressImage(file);
    }
  }
}

run().catch(console.error);
