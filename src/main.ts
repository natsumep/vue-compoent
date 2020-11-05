import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Message } from "element-ui";
Vue.prototype.$message = Message;
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
