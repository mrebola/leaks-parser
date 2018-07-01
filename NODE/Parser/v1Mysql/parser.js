const mysql = require('mysql2/promise')
const split2 = require('split2')
const fs = require('fs-extra')
const readline = require('readline')

let connection = null
let processedFiles = 0
let processedAccs = 0

function readFiles() {
  return new Promise((resolve, reject) => {
    let filesArr = []

    process.stdin
    .pipe(split2())
    .on('data', function (line) {
      filesArr.push(line)
    })
    .on('end', function () {
      resolve(filesArr)
    })
  })
}

function parseFile(route) {
  return new Promise((resolve, reject) => {
    const accounts = []
    const rl = readline.createInterface({
      input: fs.createReadStream(route, { encoding: 'utf8' }),
      output: null,
    })
    rl.on('line', (line) => {
      const sepIndex = line.indexOf(':')
      const email = line.slice(0, sepIndex)
      const pass = line.slice(sepIndex + 1)
      accounts.push([email, pass])
    })
   rl.on('close', () => resolve(accounts))
  })
}

async function saveAccs(accs) {
  let count = 0
  let proms = []
  console.log('Building promises for', accs.length, 'accounts')
  for (const account of accs) {
    const query = 'INSERT INTO leak_2017_41g_2 (email, pass) VALUES (?, ?)'
    const prom = connection.execute(query, [account[0], account[1]])
    proms.push(prom)
  }
  proms = proms.map(p => p.catch(e => {
    console.error('[ERROR] saving query', e)
    return e
  }))
  await Promise.all(proms)
  console.log('Saved', accs.length, 'accounts')
 return count
}

async function main() {

  connection = await mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'p0wned',
    database : 'leaks',
    charset: 'utf8',
  })

  const filesArr = await readFiles()
  console.log('Got', filesArr.length, 'files', 'time:', Date.now())
  for (const route of filesArr) {
    if ((await fs.lstat(route)).isFile()) {
      const fileAccs = await parseFile(route)
      processedFiles++
      const proAccs = await saveAccs(fileAccs)
      processedAccs += proAccs
      console.log('Processed', processedFiles/filesArr.length, 'time:', Date.now())
    }
  }
  connection.end()
}

main()
.then(() => {
  console.log('parsing finished :)')
})
.catch((err) => {
  console.log('parsing failed :(')
  console.error(err)
})

