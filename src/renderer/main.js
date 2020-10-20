/*
 * @Author       : tongzonghua
 * @Date         : 2020-10-20 23:19:42
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2020-10-21 02:59:22
 * @Email        : tongzonghua@360.cn
 * @Description  : 
 * @FilePath     : /cli/aggna-electron-template/src/renderer/main.js
 */
import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import db from "utils/db";
import VueLazyLoad from 'vue-lazyload'
import '@/assets/styles/main.less'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$db = db;

Vue.use(VueLazyLoad, {
  loading: require('assets/imgs/loading.gif'),
  error: require('assets/imgs/error.png'),
  attempt: 3
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
