# 9 　cssを少し変更しよう

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
      /* ここから */
      header{
        color:white;
        background-color:royalblue
      }
      body {
        text-align: center;
        background-color:#EEE;
      }
      /* ここまで */
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
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>
  <body>
    <div id="app">
      <header><h1>作成するアプリの名前をつけよう</h1></header>
      <main class="scroll" ref="scrollp">
        <ul>
          <li v-for="(log, index) in logs">
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
    <script>
      const startChatBot = "startChatBot";
      const choiceA = "A";
      const choiceB = "B";
      const choiceC = "C";
      const choiceD = "D";
      const choiceE = "E";
      const choiceF = "F";
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
          submit: function(event) {
            console.log("送信！");
            this.submitPushed = true;
            this.pushNextChoiceLog(startChatBot);
          },
          pushLogs: function(speaker, text, choiceList) {
             this.logs.push({ speaker, text, choiceList });
            Vue.nextTick(() => {
              this.$refs.scrollp.scrollTop = this.$refs.scrollp.scrollHeight;
            });
          },
          submitChoice: function(choice, index) {
            var choiceText = choice.text;
            this.pushLogs("You", choiceText, []);
            for (var choice of this.logs[index].choiceList) {
              choice.isPushed = true;
            }
            setTimeout(() => this.pushNextChoiceLog(choiceText), 800);
          },
          pushNextChoiceLog: function(choiceText) {
            var text;
            var choiceList = [];
            switch (choiceText) {
              case startChatBot:
                text = "choice A or B";
                choiceList = [this.getChoiceObject(choiceA), this.getChoiceObject(choiceB) ];
                break;
              case choiceA:
                text = "choice C or D";
                choiceList = [this.getChoiceObject(choiceC), this.getChoiceObject(choiceD) ];
                break;
              case choiceB:
                text = "choice E or F";
                choiceList = [this.getChoiceObject(choiceE), this.getChoiceObject(choiceF) ];
                break;
              default:
                text = "finish";
                break;
            }
            this.pushLogs("Chat bot", text, choiceList);
          },
          getChoiceObject: function(t) {
            return {
              text: t,
              isPushed: false
            };
          }
        }
      });
    </script>
  </body>
</html>
```
