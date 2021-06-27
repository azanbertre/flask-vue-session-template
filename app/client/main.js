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
    store,

    mounted() {
        window.addEventListener("storage", this.onStorageUpdate);
    },
    beforeDestroy() {
        // remove listeners
        window.removeEventListener("storage", this.onStorageUpdate);
    },

    methods: {
        onStorageUpdate(event) {
            if (event.key !== "appHasAuth") return;

            const localAuthenticated = event.newValue === "1";

            // * got login, login if needed
            if (localAuthenticated && !this.$store.getters.isAuthenticated) {
                this.$store.dispatch("refresh").then(() => {
                    if (this.$store.getters.isAuthenticated && this.$route.matched.some(record => record.meta.authenticated === false)) {
                        return this.$router.push({ name: "Home"});
                    }
                });
            }

            // * got logout, logout if needed
            if (!localAuthenticated && this.$store.getters.isAuthenticated) {
                this.$store.dispatch("logout").then(() => {
                    if (this.$route.matched.some(record => record.meta.authenticated)) {
                        return this.$router.push({ name: "Login"});
                    }
                }).catch(() => {
                    if (this.$route.matched.some(record => record.meta.authenticated)) {
                        return this.$router.push({ name: "Login"});
                    }
                });
            }
        }
    }
});
