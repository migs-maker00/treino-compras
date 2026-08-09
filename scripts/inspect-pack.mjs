import ExcelJS from 'exceljs'
import fs from 'fs'
import path from 'path'
import { excelPacks } from '../src/lib/excelPacks.js'
import JSZip from 'jszip'

const pack = excelPacks[0]
const wb = await pack.build(ExcelJS)
const buf = await wb.xlsx.writeBuffer()
fs.writeFileSync('pack1.xlsx', Buffer.from(buf))

const zip = await JSZip.loadAsync(buf)
for (const name of Object.keys(zip.files)) {
  if (!name.endsWith('.xml')) continue
  const text = await zip.file(name).async('string')
  if (/protect|sheetProtection|workbookProtection/i.test(text)) {
    console.log('FOUND in', name)
    const matches = text.match(/.{0,80}(protect|sheetProtection|workbookProtection).{0,80}/gi)
    console.log(matches)
  }
}
console.log('sheets:', wb.worksheets.map((s) => `${s.name} state=${s.state}`))
console.log('done', path.resolve('pack1.xlsx'), buf.byteLength)
