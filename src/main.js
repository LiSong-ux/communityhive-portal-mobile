import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import qs from 'qs';
import moment from 'moment';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

Vue.use(VueAxios, axios);
Vue.prototype.qs = qs;
Vue.use(ViewUI);

Vue.config.productionTip = false;

Vue.filter('dateFormat', function (tick) {
    return moment(tick).format("YYYY-MM-DD HH:mm:ss");
});

//开发环境
axios.defaults.baseURL = 'http://localhost:8080/communityhive_server_war_exploded';
//图片上传接口
Vue.prototype.uploadServer = 'http://localhost:8080/communityhive_server_war_exploded/upload/img';
//生产环境
//axios.defaults.baseURL = 'http://inhive.net/server';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
