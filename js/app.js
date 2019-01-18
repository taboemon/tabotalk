// TODO 色を変える処理(input)
// TODO リファクタリング
// TODO アイコン考慮
// TODO ロゴ（カスタマイズ参考サイト）
// TODO logをクリックしたら現在選択中の音声で再生

var API_URL = "https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec";
var buildQuery = function(data) {
  var q = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      q.push(`${key}=${encodeURIComponent(data[key])}`);
    }
  }
  return q.join("&");
};

var app = new Vue({
  el: "#app",
  data: {
    message: "", // 入力データの一時変数
    logs: [], // 入力データを詰めていくlist
    recognitionText: "音声入力", // ボタンのラベル
    inputLang: 'ja',
    inputLocal: "ja-JP",
    outputLang: 'en'
  },
  methods: {
    // 送信ボタンを押された場合の処理
    submit: function(event) {
      if (this.message === "") {
        return;
      }
      this.pushLogs("You", this.message, this.inputLang);
      // 翻訳モード時の処理
      var qs = buildQuery({
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
    startSpeech: function(event) {
      const speech = new webkitSpeechRecognition();
      speech.lang = this.inputLocal;
      speech.start();
      speech.onresult = e => {
        speech.stop();
        if (e.results[0].isFinal) {
          // 翻訳モードの時の処理
          var voiceText = e.results[0][0].transcript;
          this.pushLogs("You", voiceText, "img/user.png");
          var qs = buildQuery({
            text: voiceText,
            source: 'ja',
            target: this.outputLang
          });
          axios
            .get(`${API_URL}?${qs}`)
            .then(response => {
              this.pushLogs("Chat bot", response.data, "img/route66.png");
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
    changeLang: function(event) {
      if (this.outputLang === 'en') {
        this.outputLang = 'zh-cn'
      } else {
        this.outputLang = 'en'
      }
    },
    pushLogs: function(speaker, text, lang) {
      this.logs.push({ speaker, text, lang });
      Vue.nextTick(() => {
        this.$refs.scrollp.scrollTop = this.$refs.scrollp.scrollHeight;
      });
    },
    say: function(text, lang) {
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      speechSynthesis.speak(utter);
    },
  }
});
