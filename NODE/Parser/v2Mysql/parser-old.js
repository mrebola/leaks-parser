const mysql = require('mysql2/promise')
const split2 = require('split2')
const fs = require('fs-extra')
const readline = require('readline')
const SqlString = require('sqlstring')
const CliProgress = require('cli-progress')

const ACCOUNTS_QTY = 1400553901
let connection = null
let processedFiles = 0
let processedAccs = 0
let bar = null

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
  for (const account of accs) {
    const query = 'INSERT INTO leak_2017_41g_2 (email, pass) VALUES (?, ?)'
    const prom = connection.execute(query, [account[0], account[1]])
    proms.push(prom)
  }
  proms = proms.map(p => p.then(([rows, fields]) => {
    processedAccs++
    bar.update(processedAccs)
  }).catch(e => {
    console.error('[ERROR] saving query', e)
    return e
  }))
  await Promise.all(proms)
  return count
}

async function main() {
  console.log('Starting parsing 41G 😎🔥')

  // Create connection to the database, it has internal pooling system
  connection = await mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'p0wned',
    database : 'leaks',
    charset: 'utf8',
  })
  console.log('Connected to DB')

  console.log('Reading files from stdin')
  const filesArr = await readFiles()
  console.log('Found', filesArr.length, 'files', 'time:', Date.now())

  bar = new CliProgress.Bar({
   format: '{bar} {percentage}% | ETA: {eta_formatted} | {value}/{total}'
  }, CliProgress.Presets.shades_classic)
  bar.start(ACCOUNTS_QTY, 0)

  for (const route of filesArr) {
    if ((await fs.lstat(route)).isFile()) {
      const fileAccs = await parseFile(route)
      processedFiles++
      const proAccs = await saveAccs(fileAccs)
      processedAccs += proAccs
    }
  }
  bar.stop()
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

