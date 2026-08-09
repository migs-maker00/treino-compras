import ExcelJS from 'exceljs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { excelPacks } from '../src/lib/excelPacks.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'exercicios')
fs.mkdirSync(outDir, { recursive: true })

for (const pack of excelPacks) {
  const wb = await pack.build(ExcelJS)
  const filePath = path.join(outDir, pack.filename)
  await wb.xlsx.writeFile(filePath)
  const stat = fs.statSync(filePath)
  console.log(`OK ${pack.filename} (${stat.size} bytes)`)
}

console.log('Packs gerados em public/exercicios')
