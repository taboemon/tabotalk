// TODO 色を変える処理(input)
// TODO リファクタリング
// TODO アイコン考慮
// TODO ロゴ（カスタマイズ参考サイト）
// TODO 音声再生中入力を不可にする

const API_URL = "https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec";
let buildQuery = function (data) {
  let q = [];
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      q.push(`${key}=${encodeURIComponent(data[key])}`);
    }
  }
  return q.join("&");
};

let app = new Vue({
  el: "#app",
  data: {
    message: "", // 入力データの一時変数
    logs: [], // 入力データを詰めていくlist
    recognitionText: "音声入力", // ボタンのラベル
    inputLang: '',
    outputLang: ''
  },
  methods: {
    // 送信ボタンを押された場合の処理
    submit: function (event) {
      if (this.message === "") {
        return;
      }
      if (this.inputLang === this.outputLang) {
        return alert('Not translated');
      }
      if (this.inputLang === "" || this.outputLang === "") {
        return alert('Please select a language');
      }
      this.pushLogs("You", this.message, this.inputLang);
      // 翻訳モード時の処理
      let qs = buildQuery({
        text: this.message,
        source: this.inputLang,
        target: this.outputLang
      });
      console.log(`${API_URL}?${qs}`)
      axios
        .get(`${API_URL}?${qs}`)
        .then(response => {
          this.pushLogs("Chat bot", response.data, this.outputLang);
          this.say(response.data, this.outputLang);
        })
        .catch(error => {
          console.log(error);
        })
      this.message = "";
    },
    // 音声入力の処理
    startSpeech: function (event) {
      if (this.inputLang === this.outputLang) {
        return alert('Not translated');
      }
      if (this.inputLang === "" || this.outputLang === "") {
        return alert('Please select a language');
      }
      const speech = new webkitSpeechRecognition();
      speech.lang = this.inputLang;
      speech.start();
      speech.onresult = e => {
        speech.stop();
        if (e.results[0].isFinal) {
          // 翻訳モードの時の処理
          let voiceText = e.results[0][0].transcript;
          this.pushLogs("You", voiceText, this.inputLang);
          let qs = buildQuery({
            text: voiceText,
            source: this.inputLang,
            target: this.outputLang
          });
          axios
            .get(`${API_URL}?${qs}`)
            .then(response => {
              this.pushLogs("Chat bot", response.data, this.outputLang);
              this.say(response.data, this.outputLang);
            })
            .catch(error => {
              console.log(error);
            });
        }
        false;
      };

      speech.onend = () => {
        this.recognitionText = "音声入力";
      };

      speech.onsoundstart = () => {
        this.recognitionText = "Processing";
      };

      speech.onsoundend = () => {
        this.recognitionText = "Waiting";
      };
    },
    pushLogs: function (speaker, text, lang) {
      this.logs.push({ speaker, text, lang });
      Vue.nextTick(() => {
        this.$refs.scrollp.scrollTop = this.$refs.scrollp.scrollHeight;
      });
    },
    say: function (text, lang) {
      let utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      speechSynthesis.speak(utter);
    },
  }
});
