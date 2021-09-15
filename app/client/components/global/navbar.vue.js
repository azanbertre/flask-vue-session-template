const navbar = Vue.component("Navbar", {
    template: /* html */
        `
        <v-container>
            <v-app-bar app color="primary" dark dense>
                <v-toolbar-title>
                    <v-btn text :to="{ name: 'Home' }">App</v-btn>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                
                <template v-if="!isAuthenticated && $route.path != '/login'">
                    <v-btn :to="{ name: 'Login' }">Login</v-btn>
                </template>
                <template v-else-if="isAuthenticated">
                    <span class="mr-5">Logged in as {{ $store.getters.user.username }}</span>
                    <v-btn @click="logout">Logout</v-btn>
                </template>
            </v-app-bar>
        </v-container>
    `,

    props: [],

    data: () => {
        return {
            tab: null,
            code: "",
        }
    },

    computed: {
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        }
    },

    methods: {
        logout() {
            this.$store.dispatch("logout");
        }
    }
});
