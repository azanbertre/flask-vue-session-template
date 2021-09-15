const notification = Vue.component("Notification", {
    template: /* html */
        `
        <v-alert
            dismissable
            elevation="5"
            :type="notification.type"
        >
            <span>{{ notification.text }}</span>
        </v-alert>
    `,

    props: {
        notification: Object
    },

    data() {
        return {
            timer: null,
        }
    },

    mounted() {
        const timeout = this.notification.hasOwnProperty("timeout") ? this.notification.timeout : true;

        if (!timeout) return;

        const delay = this.notification.delay || 3000;
        this.timer = setTimeout(() => {
            this.close(this.notification);
        }, delay);
    },

    methods: {
        close(notification) {
            clearTimeout(this.timer);
            this.$emit("close", notification);
        }
    },
});
