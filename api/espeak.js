const bodyParser = require('body-parser')
const app = require('express')()
const fs = require('fs')
const tmp = require('tmp')
const exec = require('child_process').exec;

const eSpeakExecutable = process.platform === "win32" ? `"C:\\Program Files\\eSpeak NG\\espeak-ng.exe"` : `/usr/bin/espeak-ng`

app.use(bodyParser.json())
app.post('/get', (req, res, next) => {
  tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
    if (err) throw err;

    fs.writeFile(path, req.body.sourceText, {encoding: "utf-8"}, ()=> {
      exec(`${eSpeakExecutable} -v"${req.body.selectedLanguage}" -q -f "${path}" --ipa`, ((error, stdout, stderr) => {
        res.json({out: stdout.trim(), stderr})
      }))
    })

    cleanupCallback()
  });
})

module.exports = app

