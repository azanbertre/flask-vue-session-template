const homePage = Vue.component("HomePage", {
    template: /* html */`
        <v-container class="fill-height home-page" fluid>
            <v-row justify="center">
                <v-col cols="2">
                    <h1 class="text-center">Hello</h1>
                </v-col>
            </v-row>
        </v-container>`,

    data: () => {
        return {

        }
    },

    created() {
        setInterval(() => {
            console.log(this.$store)
            this.$store
                .commit('notifications/ADD_NOTIFICATION', {
                    title: 'Success!',
                    text: "test",
                    type: 'success',
                    timeout: true,
                    delay: 10000
                });
        }, 2000)
    },

    methods: {

    },
});
