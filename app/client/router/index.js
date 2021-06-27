import store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: homePage
    },
    {
        path: "/login",
        name: "Login",
        component: loginPage,
        meta: {
            authenticated: false
        }
    },
];

const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach(async (to, from, next) => {
    // seems authenticated but has no user info, so refresh auth
    if (!store.getters.isAuthenticated && store.getters.isLocalAuthenticated) {
        await store.dispatch('refresh');
    }
    if (to.matched.some(record => record.meta.authenticated === false)) {
        if(store.getters.isAuthenticated){
            return next({ name: "Home"})
        }
        return next();
    }
    if (to.matched.some(record => record.meta.authenticated === true)) {
        if(!store.getters.isAuthenticated){
            return next({ name: "Login"})
        }
        return next();
    }
    return next();
})

export default router;
