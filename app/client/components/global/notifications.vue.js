const notifications = Vue.component("Notifications", {
    template: /* html */
        `
        <div class="notifications">
            <div>
                <notification 
                    v-for="(notification, index) in notifications" 
                    :key="notification.text + index"
                    :notification="notification" 
                    @close="remove" 
                ></notification>
            </div>
        </div>
    `,

    props: {},

    data: () => {
        return {

        }
    },

    computed: {
        notifications() {
            return this.$store.getters["notifications/list"];
        }
    },

    methods: {
        remove(notification) {
            this.$store.commit("notifications/REMOVE_NOTIFICATION", notification);
        }
    }
});
