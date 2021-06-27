import router from "./router/index.js";
import api from "./api/index.js";
import store from "./store/index.js";


Vue.prototype.$api = api;

const app = new Vue({
    el: "#app",
    vuetify: new Vuetify({
        icons: {
            iconfont: "mdi",
        },
    }),
    router,
    store
});
