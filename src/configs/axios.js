import axios from "axios";

const api = axios.create({
  //baseURL: "http://14.225.218.46:8080/api/",
   baseURL: "http://localhost:8080/api/",
});

api.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  export default api;