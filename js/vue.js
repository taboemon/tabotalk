// TODO スクロール問題(本当に今ひどい)
// TODO 色を変える処理(input)
// TODO リファクタリング
// TODO アイコン考慮
// TODO 中国語問題（相談）
// TODO レスポンスを少し遅らせたい
// TODO ロゴ

var app = new Vue({
  el: "#app",
  data: {
    message: "", // 入力データの一時変数
    logs: [], // 入力データを詰めていくlist
    inputVoice: false, // 音声入力が行われた時trueに
    recognitionText: "音声入力"// ボタンのラベル
  },
  methods: {
    // 送信ボタンを押された場合の処理
    submit: function(event) {
      this.inputVoice = false;
      if (this.message === "") {
        return;
      }
      this.pushLogs("You", this.message, "img/user.png");
      // 翻訳モード時の処理
      this.scrollLogs(1);
      axios
        .get(
          `https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=${
            this.message
          }&source=ja&target=en`
        )
        .then(response =>
          this.pushLogs("Chat bot", response.data, "img/route66.png")
        )
        .catch(error => {
          console.log(error);
        })
        .finally(() => this.scrollLogs(1));
      this.message = "";
    },
    // 音声入力の処理
    startSpeech: function(event) {
      this.inputVoice = true;
      const speech = new webkitSpeechRecognition();
      speech.lang = "ja-JP";
      speech.start();
      speech.onresult = e => {
        speech.stop();
        if (e.results[0].isFinal) {
          // 翻訳モードの時の処理
          var voiceText = e.results[0][0].transcript;
          this.pushLogs("You", voiceText, "img/user.png");
          this.scrollLogs(1);
          speech.lang = "en-US";
          axios
            .get(
              `https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=${voiceText}&source=ja&target=en`
            )
            .then(response =>
              this.pushLogs("Chat bot", response.data, "img/route66.png")
            )
            .catch(error => {
              console.log(error);
            })
            .finally(() =>
              speechSynthesis.speak(
                new SpeechSynthesisUtterance(this.logs.slice(-1)[0].text)
              )
            );
          // TODO 原因追求
          this.scrollLogs(1100);
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
    scrollLogs: function(time) {
      Vue.nextTick(()=>{
        this.$refs.scrollp.scrollBy(0, this.$refs.scrollp.offsetHeight);
      });
    },
    pushLogs: function(speaker, text, img) {
      this.logs.push({ speaker: speaker, text: text, img: img });
    }
  }
});
