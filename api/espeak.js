import axios from "axios";
import {getTag} from "@sozialhelden/ietf-language-tags";

const bodyParser = require('body-parser')
const app = require('express')()
const fs = require('fs')
const tmp = require('tmp')
const exec = require('child_process').exec;
const _ = require('lodash');

const builder = require('xmlbuilder');



require("dotenv").config()

const azureSpeech = require("microsoft-cognitiveservices-speech-sdk")
const {SpeechSynthesisOutputFormat} = require("microsoft-cognitiveservices-speech-sdk");
const speechConfig = azureSpeech.SpeechConfig.fromSubscription(process.env.AZURE_KEY, process.env.AZURE_REGION)
speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Ogg24Khz16BitMonoOpus

const eSpeakExecutable = process.platform === "win32" ? `"C:\\Program Files\\eSpeak NG\\espeak-ng.exe"` : `/usr/bin/espeak-ng`

app.use(bodyParser.json())
app.post('/get', (req, res, next) => {
  tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
    if (err) throw err;

    fs.writeFile(path, req.body.sourceText.replace(/\n/gi,",\n"), {encoding: "utf-8"}, ()=> {
      exec(`${eSpeakExecutable} -v"${req.body.selectedLanguage}" -q -f "${path}" --ipa`, ((error, stdout, stderr) => {
        res.json({out: stdout.trim(), stderr: stderr.trim()})
        cleanupCallback()
      }))
    })
  });
})

app.get('/getLanguages', async (req, res, next) => {
  try {

    const languages = (await axios.get(`https://${process.env.AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list`, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY
      }
    })).data
    const grouped = _.groupBy(languages, x=>x.Locale)
    let obj = []
    for (const [key, value] of Object.entries(grouped)){
      const tag = getTag(key)
      obj.push({
        label: `${tag.language.Description[0]} (${tag.region.Description[0]})`,
        options: value.map(x=>{
          return {
            text: `${x.DisplayName} (${x.LocalName}, ${x.Gender}, ${x.VoiceType})`,
            value: x.ShortName
          }
        }).sort((a, b) => a.text > b.text ? 1 : -1)
      })
    }
    res.json(obj.sort((a, b) => a.label > b.label ? 1 : -1))
  } catch(e) {
    next(e)
  }
})

app.post('/speak', async (req, res, next) => {
  const synthesizer = new azureSpeech.SpeechSynthesizer(speechConfig)

  const splitLines = req.body.targetText.split("\n")
  const language = req.body.selectedSpeechLanguage.split("-").slice(0,2).join("-")

  let root = builder.create("speak")
  root.att("version","1.0")
  root.att("xmlns", "http://www.w3.org/2001/10/synthesis")
  root.att("xml:lang", language)
  let voice = root.ele("voice").att("name", req.body.selectedSpeechLanguage)

  for (const line of splitLines) {
    voice.ele("phoneme").att("alphabet","ipa").att("ph",line).t(line)
  }

  const xml = root.toString()

  synthesizer.speakSsmlAsync(xml, result => {
    const audioData = result.audioData;
    res.contentType("audio/ogg; codecs=opus").send(Buffer.from(audioData))
  })

})

module.exports = app

