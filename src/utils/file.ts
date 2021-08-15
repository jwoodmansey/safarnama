import * as fs from 'fs'

export async function makeDirectoryIfNotExists(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
}