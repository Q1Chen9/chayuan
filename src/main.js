import {createApp} from 'vue'
import './style.css'
import './utils/flexible'
import App from './App.vue'
import router from "./router"
import 'echarts-liquidfill'
import 'wow.js/css/libs/animate.css'
import disableDevtool from 'disable-devtool';
import { VueSeamlessScroll } from '@meruem117/vue-seamless-scroll'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import './styles/index.scss'
// 检查当前域名是否符合 *.wanjunshijie.com
function checkDomain() {
    return window.location.hostname.endsWith('.wanjunshijie.com');
}

// 如果符合条件，禁用开发者工具并设置重定向
if (checkDomain()) {
    disableDevtool({
        ondevtoolopen: function() {
            window.location.href = 'https://www.wanjunshijie.com';
        }
    });
}
// 百度统计代码 加密防止被爬虫抓取id刷流量
var mnP1 = mnP1 || [];
(function () {
    // 检查当前域名是否以 "wanjunshijie.com" 结尾
    if (window.location.hostname.endsWith("wanjunshijie.com")) {
        var kkLvROf2 = document.createElement("script");
        // 分割 URL 字符串
        var part1 = "https://hm.baidu.com/hm.js?";
        var part2 = "09a325075edcebb1ac0e2a0be62a88dd";
        // 动态拼接 URL
        kkLvROf2.src = part1 + part2;
        var uRm3 = document.getElementsByTagName("script")[0];
        uRm3.parentNode.insertBefore(kkLvROf2, uRm3);
    }
})();

createApp(App)
  .use(router)
  .use(VueSeamlessScroll)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')
