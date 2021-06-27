const loginPage = Vue.component("LoginPanel", {
    template: /* html */
    `<v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Login</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-alert :value="alert.show" type="error" dismissible @input="alert.show = $event">{{ alert.message }}</v-alert>
                        <v-text-field v-model="username" label="Username" name="username" prepend-icon="mdi-account" type="text" />
                        <v-text-field v-model="password" id="password" label="Password" name="password" prepend-icon="mdi-lock" type="password" />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" block @click="login">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>`,

    data() {
        return {
            username: "",
            password: "",
            alert: {
                show: false,
                message: ''
            }
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
                this.alert = {
                    show: true,
                    message: "Invalid Login"
                }
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
                    this.alert = {
                        show: true,
                        message: data.message
                    }
                    this.password = "";
                }
            }).catch(err => {
                this.alert = {
                    show: true,
                    message: "Something went wrong"
                }
                this.password = "";
            });
        }
    },
});
