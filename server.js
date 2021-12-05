const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const ID3Writer = require('browser-id3-writer')
const mm = require('music-metadata');
const fs = require('fs')

const app = express()
app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const PORT = 4390
app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:%s", PORT)
})

app.get('/', function (req, res) {
  res.render('index')
})

app.post('/', function (req, res) {
  renameFiles(req.body.inputPath, req.body.files, req.body.outputPath)
  res.send('Переименование прошло успешно')
})

async function renameFiles(inputPath, filesArray, outputPath) {
  for (const file of filesArray) {
    const songBuffer = fs.readFileSync(inputPath + '\\' + file + '.mp3')
    const artist = file.split(' - ')[0]
    const name = file.split(' - ')[1]
    let picture = null;

    try {
      const metadata = await mm.parseBuffer(songBuffer);
      if (metadata && metadata.common && metadata.common.picture) {
        picture = mm.selectCover(metadata.common.picture)
      }
    } catch (error) {
      console.error('Ошибка при чтении метаданных файла:\n' + error.message);
    }

    const writer = new ID3Writer(songBuffer)
    writer
      .setFrame('TIT2', name)
      .setFrame('TPE1', [artist])
    if (picture && picture.data) {
      writer
        .setFrame('APIC', {
          type: 3,
          data: picture.data,
          description: ''
        })
    }
    writer.addTag()

    const taggedSongBuffer = Buffer.from(writer.arrayBuffer)
    fs.writeFileSync(outputPath + '\\' + file + '.mp3', taggedSongBuffer)
  }
}