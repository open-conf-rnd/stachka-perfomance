#!/usr/bin/env node
/**
 * Скриншотит каждый шаг Reveal.js (слайд + фрагменты) и собирает один PDF.
 *
 * Один раз установить браузер:
 *   npx playwright install chromium
 *
 * Запуск:
 *   node scripts/export-presentation-pdf.mjs
 *   PRESENTATION_URL=https://localhost:5173/presentation OUTPUT_PDF=out.pdf node scripts/export-presentation-pdf.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { PDFDocument } from 'pdf-lib'

const DEFAULT_URL = 'https://open-conf-rnd.pro/presentation'
const VIEWPORT = { width: 1920, height: 1080 }
const MAX_STEPS = 600
const TRANSITION_MS = 450

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function getArg(name, fallback) {
  const i = process.argv.indexOf(name)
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1]
  return fallback
}

async function main() {
  const url = process.env.PRESENTATION_URL ?? getArg('--url', DEFAULT_URL)
  const outPath = process.env.OUTPUT_PDF ?? getArg('--out', 'presentation-slides.pdf')
  const keepFrames = process.env.KEEP_FRAMES === '1'

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  await page.addStyleTag({
    content: `
      .reveal .controls,
      .reveal .progress,
      .reveal .slide-number,
      .presentation-qr-notifications-overlay {
        display: none !important;
      }
    `,
  })

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120_000 })
  await page.waitForSelector('.reveal', { timeout: 90_000 })
  await page.waitForSelector('.reveal .slides section.present', {
    state: 'attached',
    timeout: 90_000,
  })
  await page.waitForLoadState('networkidle', { timeout: 120_000 }).catch(() => {})
  await sleep(1200)

  /** @type {Set<string>} */
  const seenHashes = new Set()
  const frames = []
  let steps = 0

  while (steps < MAX_STEPS) {
    const hash = await page.evaluate(() => location.hash)
    if (seenHashes.has(hash)) break

    const png = await page.locator('.reveal').first().screenshot({ type: 'png' })
    frames.push(png)
    seenHashes.add(hash)

    const hashBefore = await page.evaluate(() => location.hash)
    await page.keyboard.press('ArrowRight')

    try {
      await page.waitForFunction((h) => location.hash !== h, hashBefore, { timeout: 5000 })
    } catch {
      await sleep(TRANSITION_MS)
    }
    await sleep(TRANSITION_MS)

    steps += 1
  }

  await browser.close()

  if (frames.length === 0) {
    console.error('Не удалось снять ни одного кадра.')
    process.exit(1)
  }

  const pdfDoc = await PDFDocument.create()
  for (const buf of frames) {
    const img = await pdfDoc.embedPng(buf)
    const w = img.width
    const h = img.height
    const pagePdf = pdfDoc.addPage([w, h])
    pagePdf.drawImage(img, { x: 0, y: 0, width: w, height: h })
  }
  const pdfBytes = await pdfDoc.save()
  await writeFile(outPath, pdfBytes)

  console.log(`Готово: ${frames.length} кадров → ${outPath}`)

  if (keepFrames) {
    const dir = join(tmpdir(), `presentation-frames-${Date.now()}`)
    await mkdir(dir, { recursive: true })
    let i = 0
    for (const buf of frames) {
      await writeFile(join(dir, `slide-${String(i++).padStart(4, '0')}.png`), buf)
    }
    console.log(`PNG кадры: ${dir}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
