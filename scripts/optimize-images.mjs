#!/usr/bin/env node
/**
 * optimize-images.mjs
 *
 * Gera variantes WebP otimizadas ao lado dos JPG/PNG originais em
 * public/website/. Mantém os arquivos originais para fallback de browsers
 * sem suporte WebP — `next/image` em runtime escolhe o formato correto
 * baseado no header Accept.
 *
 * Uso:  npm run optimize-images
 *
 * Skipa imagens cuja .webp já existe e está mais nova que o original.
 */

import { readdir, stat } from "node:fs/promises";
import { join, parse, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SOURCE_DIR = join(ROOT, "public", "website");
const QUALITY = 82;
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

async function isOutputFresh(sourcePath, outputPath) {
  try {
    const [src, out] = await Promise.all([stat(sourcePath), stat(outputPath)]);
    return out.mtimeMs >= src.mtimeMs;
  } catch {
    return false;
  }
}

async function optimize(sourcePath) {
  const { dir, name, ext } = parse(sourcePath);
  if (!EXTENSIONS.has(ext.toLowerCase())) return null;

  const outputPath = join(dir, `${name}.webp`);

  if (await isOutputFresh(sourcePath, outputPath)) {
    return { sourcePath, outputPath, skipped: true };
  }

  const sourceStat = await stat(sourcePath);
  await sharp(sourcePath)
    .rotate() // honra EXIF orientation antes de descartar metadata
    .webp({ quality: QUALITY, effort: 6 })
    .withMetadata({}) // remove EXIF — inclui GPS, câmera, etc.
    .toFile(outputPath);
  const outputStat = await stat(outputPath);

  return {
    sourcePath,
    outputPath,
    sourceBytes: sourceStat.size,
    outputBytes: outputStat.size,
    skipped: false,
  };
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  const results = [];
  for await (const path of walk(SOURCE_DIR)) {
    const result = await optimize(path);
    if (result) results.push(result);
  }

  let totalIn = 0;
  let totalOut = 0;
  for (const r of results) {
    const rel = relative(ROOT, r.outputPath);
    if (r.skipped) {
      console.log(`  skip   ${rel}`);
      continue;
    }
    totalIn += r.sourceBytes;
    totalOut += r.outputBytes;
    const pct = (((r.sourceBytes - r.outputBytes) / r.sourceBytes) * 100).toFixed(0);
    console.log(
      `  webp   ${rel}  ${formatBytes(r.sourceBytes)} → ${formatBytes(r.outputBytes)}  (-${pct}%)`,
    );
  }

  if (totalIn > 0) {
    const pct = (((totalIn - totalOut) / totalIn) * 100).toFixed(0);
    console.log(
      `\nTotal: ${formatBytes(totalIn)} → ${formatBytes(totalOut)}  (-${pct}%)`,
    );
  } else {
    console.log("\nNenhuma imagem precisava ser reprocessada.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
