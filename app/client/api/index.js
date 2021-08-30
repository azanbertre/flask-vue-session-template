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
    },

    put(url, data, options={headers: null}, defaultRoute="/api") {
        url = host + defaultRoute + url;

        var headers = {};
        if (options.headers) headers = options.headers;


        return axios.put(url, data, {
            headers: headers
        });
    },

    patch(url, data, options={headers: null}, defaultRoute="/api") {
        url = host + defaultRoute + url;

        var headers = {};
        if (options.headers) headers = options.headers;


        return axios.patch(url, data, {
            headers: headers
        });
    },

    delete(url, data={}, options={headers: null}, defaultRoute="/api") {
        url = host + defaultRoute + url;

        var headers = {}
        if (options.headers) headers = options.headers;

        return axios.delete(url, {
            headers: headers,
            data: data
        })
    },
}

export default api;
