const notifications = {
    namespaced: true,
    state: () => ({
       list: []
    }),
    getters: {
        list: state => state.list
    },
    mutations: {
        ADD_NOTIFICATION(state, payload) {
            state.list.push(payload);
        },
        REMOVE_NOTIFICATION(state, payload) {
            state.list = state.list.filter(notification => notification.text !== payload.text);
        }
    }
}


export default notifications;
