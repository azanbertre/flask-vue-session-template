const homePage = Vue.component("HomePage", {
    template: /* html */`
        <v-container class="fill-height home-page px-0" fluid>
            <v-app-bar app color="primary" dark dense>
                <v-toolbar-title>APP</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-app-bar>

            <v-row justify="center">
                <v-col cols="2">
                    <h1 class="text-center">Hello</h1>
                </v-col>
            </v-row>
        </v-container>`,

    created() {

    },

    methods: {

    },

    data: () => {
        return {

        }
    }
});
