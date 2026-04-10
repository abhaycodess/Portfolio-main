import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = path.resolve("public/Photos-1-001");
const outputDesktopDir = path.resolve("public/Photos-1-001/optimized");
const outputMobileDir = path.resolve("public/Photos-1-001/optimized/mobile");

const desktopWidth = 1280;
const mobileWidth = 720;
const desktopQuality = 72;
const mobileQuality = 64;

async function optimizePhoto(fileName) {
  const sourcePath = path.join(sourceDir, fileName);
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const desktopOutputPath = path.join(outputDesktopDir, `${baseName}.webp`);
  const mobileOutputPath = path.join(outputMobileDir, `${baseName}.webp`);

  await sharp(sourcePath)
    .rotate()
    .resize({ width: desktopWidth, withoutEnlargement: true })
    .webp({ quality: desktopQuality, effort: 4 })
    .toFile(desktopOutputPath);

  await sharp(sourcePath)
    .rotate()
    .resize({ width: mobileWidth, withoutEnlargement: true })
    .webp({ quality: mobileQuality, effort: 4 })
    .toFile(mobileOutputPath);

  return { fileName, desktopOutputPath, mobileOutputPath };
}

async function main() {
  await mkdir(outputDesktopDir, { recursive: true });
  await mkdir(outputMobileDir, { recursive: true });

  const files = await readdir(sourceDir);
  const imageFiles = files.filter((fileName) => /\.(jpe?g|png)$/i.test(fileName));

  if (!imageFiles.length) {
    console.log("No source images found in public/Photos-1-001.");
    return;
  }

  console.log(`Optimizing ${imageFiles.length} photos...`);
  for (const fileName of imageFiles) {
    await optimizePhoto(fileName);
    console.log(`- optimized ${fileName}`);
  }
  console.log("Photo optimization complete.");
}

main().catch((error) => {
  console.error("Photo optimization failed.");
  console.error(error);
  process.exitCode = 1;
});
