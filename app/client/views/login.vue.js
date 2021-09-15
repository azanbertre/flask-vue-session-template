const loginPage = Vue.component("LoginPanel", {
    template: /* html */
    `<v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-form @submit.prevent="login">
                    <v-card class="elevation-12">
                        <v-toolbar color="primary" dark flat>
                            <v-toolbar-title>Login</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                        outlined 
                                        hide-details 
                                        v-model="username" 
                                        label="Username" 
                                        name="username" 
                                        prepend-icon="mdi-account" 
                                        type="text" />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field 
                                        outlined 
                                        hide-details
                                        v-model="password" 
                                        label="Password" 
                                        name="password" 
                                        autocomplete 
                                        prepend-icon="mdi-lock" 
                                        type="password" />
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="primary" block type="submit">Login</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
    </v-container>`,

    data() {
        return {
            username: "",
            password: "",
        }
    },

    mounted() {

    },

    methods: {
        isValidLogin() {
            if (!this.username || !this.password) return false;
            return true;
        },

        login() {
            if (!this.isValidLogin()) {
                this.$store.commit("notifications/ADD_NOTIFICATION", {
                    type: "error",
                    text: "Invalid Login",
                    timeout: true
                });
                return;
            }

            this.$api.post("/auth/login", {
                "username": this.username,
                "password": this.password
            }).then(res => {
                const data = res.data;

                if (data.success) {
                    this.$store.commit("authenticate", data.data.user);
                    this.$router.push("/");
                } else {
                    this.password = "";

                    this.$store.commit("notifications/ADD_NOTIFICATION", {
                        type: "error",
                        text: data.message,
                        timeout: true
                    });
                }
            }).catch(err => {
                const data = err.response.data;

                this.password = "";

                let message = "Something went wrong";
                if (data && data.message) {
                    message = data.message;
                }

                this.$store.commit("notifications/ADD_NOTIFICATION", {
                    type: "error",
                    text: message,
                    timeout: true
                });
            });
        }
    },
});
