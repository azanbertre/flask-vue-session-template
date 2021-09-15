import api from "../api/index.js";
import router from "../router/index.js";
import notifications from "./notifications.js";

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        user: {}
    },
    modules: {
        notifications: notifications
    },
    mutations: {
        authenticate(state, user) {
            state.user = user;
            localStorage.setItem("appHasAuth", "1");
        },
        logout(state) {
            state.user = {};
            localStorage.setItem("appHasAuth", "0");
        }
    },
    getters: {
        user(state) {
            return state.user;
        },
        isAuthenticated(state) {
            if (state.user === null) return false;
            if (state.user === {}) return false;
            if (!state.user.username || state.user.username.length <= 0) return false;
            return true;
        },
        isLocalAuthenticated(state) {
            return localStorage.getItem("appHasAuth") === "1";
        },
        isAdmin(state) {
            if (state.user === null) return false;
            if (state.user === {}) return false;
            return state.user.groups && state.user.groups.includes("admin");
        },
    },
    actions: {
        refresh(store) {
            return api.get("/auth/refresh").then(res => {
                const data = res.data;

                if (data.success) {
                    store.commit("authenticate", data.data.user);
                } else {
                    store.commit("logout");
                }
            }).catch(err => {
                store.commit("logout");
            });
        },

        logout(store) {
            return api.post("/auth/logout").then(res => {
                store.commit("logout");
                router.push({ name: "Login" });
            }).catch(err => {
                store.commit("logout");
                router.push({ name: "Login" });
            })
        },
    }
});

export default store;
