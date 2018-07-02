const split2 = require('split2')
const fs = require('fs-extra')
const readline = require('readline')
const { Writable } = require('stream')
const through2 = require('through2')
const SqlString = require('sqlstring')
const CliProgress = require('cli-progress')

const ACCOUNTS_QTY = 1400553901
let connection = null
let processedFiles = 0
let processedAccs = 0
let bar = null

function accParser() {
  return through2({ objectMode: true }, (chunk, enc, callback) => {
    const sepIndex = chunk.indexOf(':')
    const email = chunk.slice(0, sepIndex)
    const pass = chunk.slice(sepIndex + 1)
    callback(null, { email, pass })
  })
}

class AccWriter extends Writable {
  constructor(options = {}) {
    options.objectMode = true
    super(options)
    this.CONCURRENCY = 100
    this.pending = 0
    this.bufferAcc = null
    this.bufferCb = null
  }

  _write(chunk, enc, callback) {
    // if available queue and returns, if not returns until is queued
    this.save(chunk, () => {
      processedAccs++
      bar.update(processedAccs)
      callback()
    })
  }
 
  save(acc, callback) {
    // console.log('SAVE: ', acc, this.pending, this.CONCURRENCY)
    if (this.pending < this.CONCURRENCY) {
      this.pending++
      const query = 'INSERT INTO leak_2017_41g_2 (email, pass) VALUES (?, ?)'
      connection.execute(query, [acc.email, acc.pass])
        .then(() => {
          // console.log('Query success')
          this.pending--
          if (this.bufferAcc) {
            // console.log('Processing buffered query')
            this.save(this.bufferAcc, this.bufferCb)
          }
        })

      if (this.bufferAcc) {
        this.bufferAcc = null
        this.bufferCb = null
      }
  
      callback()
    } else {
      // console.log('Reached MAX Concurrency, buffering query')
      this.bufferAcc = acc
      this.bufferCb = callback
    }
  }
}

class Parser extends Writable {
  constructor(options = {}) {
    options.decodeStrings = false // strings will be strings
    super(options)
    this.resolve = null
    this.reject = null

  }

  parse() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
      //console.log('starting parsing')
      this.start()
    })
  }

  start() {
    //console.log('starting piping')
    process.stdin
      .pipe(split2())
      .pipe(this)

    this.on('finish', () => {
      processedFiles++
      this.resolve()
    })
  }

  _write(chunkStr, encoding, callback) {
    //console.log('possible file name: ', chunkStr)

    fs.lstat(chunkStr, (err, stats) => {
      if (stats.isFile()) {
        //console.log('Starting read stream for file', chunkStr)
        fs.createReadStream(chunkStr, { encoding: 'utf8' })
          .pipe(split2())
          .pipe(accParser())
          .pipe(new AccWriter())
          .on('finish', () => {
            console.log('Finished file', chunkStr)
            callback()
          })
      } else {
        callback()
      }
    })
  }

}

async function main() {
  console.log('Starting parsing 41G 😎🔥')

  connection = await mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'p0wned',
    database : 'leaks',
    charset: 'utf8',
  })
  console.log('Connected to DB')

  bar = new CliProgress.Bar({
    format: '{bar} {percentage}% | ETA: {eta_formatted} | {value}/{total}'
  }, CliProgress.Presets.shades_classic)
  bar.start(ACCOUNTS_QTY, 0)

  const parser = new Parser()
  await parser.parse()
  console.log('parse finished')

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