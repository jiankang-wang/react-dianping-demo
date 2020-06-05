
export default function auth(axios) {
  axios.interceptors.request.use(async (config) => {
    // eslint-disable-next-line
    // config.headers.session = status.sessionId;
    // eslint-disable-next-line
    // config.headers.token= status.sessionId;
    return config;
  }, async err => err);
}