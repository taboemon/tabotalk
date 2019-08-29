# 6 　vueを使ってみよう

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>好きなタイトルを書いてね</title>
    <link rel="shortcut icon" href="img/favicon.png" />
    <style>
      #app {
        display: flex;
        min-height: 90vh;
        flex-direction: column;
      }
      body {
        text-align: center;
      }
      main {
        flex: auto;
      }
      ul {
        list-style: none;
        text-align: left;
        padding-inline-start: 0px;
      }
      .scroll {
        width: 100%;
        height: 56px;
        overflow: scroll;
      }
      .choiceBox > div > button {
        margin: 5px 0;
        width: 700px;
      }
      .choiceButton {
        display: inline-block;
        text-align: left;
        box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.5), 0 2px 2px rgba(0, 0, 0, 0.19);
        color: #333;
        font-size: 16px;
        text-decoration: none;
        font-weight: bold;
        text-shadow: 1px 1px 1px rgba(255, 255, 255, 1);
        padding: 12px 24px;
        border-radius: 4px;
        font-size: 16px;
      }
      .choiceButton:hover {
        opacity: 0.8;
      }
    </style>
    <!-- ここから-->
    <!-- 8 画面を動かすためのライブラリを読み込もう -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <!-- ここまで-->
  </head>
  <body>
    <div id="app">
      <header><h1>作成するアプリの名前をつけよう</h1></header>
      <main class="scroll" ref="scrollp">
        <ul>
          <li v-for="(log, index) in logs">
            <!-- 9 ユーザ画像を描写してみよう -->
            <div v-if="log.speaker=='You'">
              <img src="img/user.png" /> <b class="log">{{ log.speaker }}</b>
              <p>{{ log.text }}</p>
              <hr />
            </div>
            <div v-if="log.speaker=='Chat bot'">
              <img src="img/route66.png" /> <b class="log">{{ log.speaker }}</b>
              <p>{{ log.text }}</p>
              <div class="choiceBox">
                <div v-for="choice in log.choiceList">
                  <button
                    class="choiceButton"
                    @click="submitChoice(choice, index)"
                    v-bind:disabled="choice.isPushed"
                  >
                    {{ choice.text }}
                  </button>
                </div>
                <hr />
            </div>
          </li>
        </ul>
      </main>
      <footer>
        <button class="choiceButton" v-on:click="submit" v-bind:disabled="submitPushed">ボタン</button>
      </footer>
    </div>
    <!-- ここから-->
    <script>
      // 10 さあ画面を動かしてみよう
      let app = new Vue({
        el: "#app",
        data: {
          submitPushed: false,
          logs: [
            {
                speaker: "Chat bot",
                text: "好きな文言を入れてね",
                choiceList: []
            }
          ]
        },
        methods: {
          // 送信ボタンを押された場合の処理
          submit: function(event) {
            console.log("送信！");
          },
          pushLogs: function(speaker, text, choiceList) {}
        }
      });
    </script>
    <!-- ここまで-->
  </body>
</html>
```
