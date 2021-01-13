<template>
  <b-container fluid class="py-3">
    <h1>IPA Server</h1>
    <b-row>
      <b-col cols="12" md="6">
        <h2>Source text</h2>
        <b-form-textarea
          id="textarea"
          v-model="sourceText"
          debounce="99"
          placeholder="Enter your text here"
          rows="12"
          max-rows="25"
          />
        <b-form-select class="mt-2" v-model="selectedLanguage" :options="languages"></b-form-select>
      </b-col>
      <b-col cols="12" md="6">
        <h2>IPA output</h2>
        <b-card>
          <pre class="text-wrap">{{targetText.out}}</pre>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      sourceText: "",
      targetText: "",
      selectedLanguage: "en-us",
      languages: [
        {
          "value": "af",
          "text": "Afrikaans"
        },
        {
          "value": "am",
          "text": "Amharic"
        },
        {
          "value": "an",
          "text": "Aragonese"
        },
        {
          "value": "as",
          "text": "Assamese"
        },
        {
          "value": "az",
          "text": "Azerbaijani"
        },
        {
          "value": "bg",
          "text": "Bulgarian"
        },
        {
          "value": "bn",
          "text": "Bengali"
        },
        {
          "value": "bs",
          "text": "Bosnian"
        },
        {
          "value": "ca",
          "text": "Catalan"
        },
        {
          "value": "cmn",
          "text": "Chinese (Mandarin)"
        },
        {
          "value": "cs",
          "text": "Czech"
        },
        {
          "value": "cy",
          "text": "Welsh"
        },
        {
          "value": "da",
          "text": "Danish"
        },
        {
          "value": "de",
          "text": "German"
        },
        {
          "value": "el",
          "text": "Greek"
        },
        {
          "value": "en-029",
          "text": "English (Caribbean)"
        },
        {
          "value": "en-gb",
          "text": "English (Great Britain)"
        },
        {
          "value": "en-gb-scotland",
          "text": "English (Scotland)"
        },
        {
          "value": "en-gb-x-gbclan",
          "text": "English (Lancaster)"
        },
        {
          "value": "en-gb-x-gbcwmd",
          "text": "English (West Midlands)"
        },
        {
          "value": "en-gb-x-rp",
          "text": "English (Received Pronunciation)"
        },
        {
          "value": "en-us",
          "text": "English (United States)"
        },
        {
          "value": "eo",
          "text": "Esperanto"
        },
        {
          "value": "es",
          "text": "Spanish (Spain)"
        },
        {
          "value": "es-419",
          "text": "Spanish (Latin America)"
        },
        {
          "value": "et",
          "text": "Estonian"
        },
        {
          "value": "eu",
          "text": "Basque"
        },
        {
          "value": "fa",
          "text": "Persian"
        },
        {
          "value": "fa-latn",
          "text": "Persian (Pinglish)"
        },
        {
          "value": "fi",
          "text": "Finnish"
        },
        {
          "value": "fr-be",
          "text": "French (Belgium)"
        },
        {
          "value": "fr-fr",
          "text": "French (France)"
        },
        {
          "value": "ga",
          "text": "Gaelic (Irish)"
        },
        {
          "value": "gd",
          "text": "Gaelic (Scottish)"
        },
        {
          "value": "gn",
          "text": "Guarani"
        },
        {
          "value": "grc",
          "text": "Greek (Ancient)"
        },
        {
          "value": "gu",
          "text": "Gujarati"
        },
        {
          "value": "hi",
          "text": "Hindi"
        },
        {
          "value": "hr",
          "text": "Croatian"
        },
        {
          "value": "hu",
          "text": "Hungarian"
        },
        {
          "value": "hy",
          "text": "Armenian (East Armenia)"
        },
        {
          "value": "hyw",
          "text": "Armenian (West Armenia)"
        },
        {
          "value": "ia",
          "text": "Interlingua"
        },
        {
          "value": "id",
          "text": "Indonesian"
        },
        {
          "value": "is",
          "text": "Icelandic"
        },
        {
          "value": "it",
          "text": "Italian"
        },
        {
          "value": "jbo",
          "text": "Lojban"
        },
        {
          "value": "ka",
          "text": "Georgian"
        },
        {
          "value": "kl",
          "text": "Greenlandic"
        },
        {
          "value": "kn",
          "text": "Kannada"
        },
        {
          "value": "ko",
          "text": "Korean"
        },
        {
          "value": "ku",
          "text": "Kurdish"
        },
        {
          "value": "ky",
          "text": "Kyrgyz"
        },
        {
          "value": "la",
          "text": "Latin"
        },
        {
          "value": "lfn",
          "text": "Lingua Franca Nova"
        },
        {
          "value": "lt",
          "text": "Lithuanian"
        },
        {
          "value": "lv",
          "text": "Latvian"
        },
        {
          "value": "mk",
          "text": "Macedonian"
        },
        {
          "value": "ml",
          "text": "Malayalam"
        },
        {
          "value": "mr",
          "text": "Marathi"
        },
        {
          "value": "ms",
          "text": "Malay"
        },
        {
          "value": "mt",
          "text": "Maltese"
        },
        {
          "value": "my",
          "text": "Myanmar (Burmese)"
        },
        {
          "value": "nb",
          "text": "Norwegian Bokmål"
        },
        {
          "value": "nci",
          "text": "Nahuatl (Classical)"
        },
        {
          "value": "ne",
          "text": "Nepali"
        },
        {
          "value": "nl",
          "text": "Dutch"
        },
        {
          "value": "om",
          "text": "Oromo"
        },
        {
          "value": "or",
          "text": "Oriya"
        },
        {
          "value": "pa",
          "text": "Punjabi"
        },
        {
          "value": "pap",
          "text": "Papiamento"
        },
        {
          "value": "pl",
          "text": "Polish"
        },
        {
          "value": "pt",
          "text": "Portuguese (Portugal)"
        },
        {
          "value": "pt-br",
          "text": "Portuguese (Brazil)"
        },
        {
          "value": "ro",
          "text": "Romanian"
        },
        {
          "value": "ru",
          "text": "Russian"
        },
        {
          "value": "si",
          "text": "Sinhala"
        },
        {
          "value": "sk",
          "text": "Slovak"
        },
        {
          "value": "sl",
          "text": "Slovenian"
        },
        {
          "value": "sq",
          "text": "Albanian"
        },
        {
          "value": "sr",
          "text": "Serbian"
        },
        {
          "value": "sv",
          "text": "Swedish"
        },
        {
          "value": "sw",
          "text": "Swahili"
        },
        {
          "value": "ta",
          "text": "Tamil"
        },
        {
          "value": "te",
          "text": "Telugu"
        },
        {
          "value": "tn",
          "text": "Setswana"
        },
        {
          "value": "tr",
          "text": "Turkish"
        },
        {
          "value": "tt",
          "text": "Tatar"
        },
        {
          "value": "ur",
          "text": "Urdu"
        },
        {
          "value": "vi",
          "text": "Vietnamese (Northern)"
        },
        {
          "value": "vi-vn-x-central",
          "text": "Vietnamese (Central)"
        },
        {
          "value": "vi-vn-x-south",
          "text": "Vietnamese (Southern)"
        },
        {
          "value": "yue",
          "text": "Chinese (Cantonese)"
        }
      ].sort((a,b)=>(a.text>b.text)?1:-1)
    }
  },
  watch: {
    async sourceText(newValue) {
      this.targetText = (await axios.post("/api/get", {
        sourceText: newValue,
        selectedLanguage: this.selectedLanguage
      })).data
    },
    async selectedLanguage(newValue) {
      this.targetText = (await axios.post("/api/get", {
        sourceText: this.sourceText,
        selectedLanguage: newValue
      })).data
    }
  }
}
</script>
