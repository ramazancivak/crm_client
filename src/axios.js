
import store from "./store/index.js"
import axios from "axios";

// Özel bir axios örneği oluştur
const apiInstance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000
});
apiInstance.interceptors.request.use(
    (config) => {
      const authToken = store.state.authToken;
      if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default apiInstance