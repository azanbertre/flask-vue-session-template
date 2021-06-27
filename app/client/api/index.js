const host = "";

const api = {
    get(url, options={headers: null}, defaultRoute="/api") {
        url = host + defaultRoute + url;

        var headers = {}
        if (options.headers) headers = options.headers;

        return axios.get(url, {
            headers: headers
        })
    },

    post(url, data, options={headers: null}, defaultRoute="/api") {
        url = host + defaultRoute + url;

        var headers = {};
        if (options.headers) headers = options.headers;


        return axios.post(url, data, {
            headers: headers
        });
    }
}

export default api;
