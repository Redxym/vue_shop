import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import ElementUI from 'element-ui' // 导入ElementUI
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import './assets/fonts/iconfont.css' // 导入字体图标
import ZkTable from 'vue-table-with-tree-grid'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/' // 配置请求的根路径
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small', locale })
// Vue.use(ZkTable)
Vue.component('tree-table', ZkTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
