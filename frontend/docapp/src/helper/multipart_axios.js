import axios from "axios";
const authToken = () => {
    const userDetail = localStorage.getItem('user');
    const user = JSON.parse(userDetail);
    return user?.token
}
const instance = axios.create({
    baseURL: "http://localhost:3000",
})
instance.interceptors.request.use((config) => {
    config.headers.Authorization = `Token ${authToken()}`;
    return config;
})
instance.defaults.headers.common["Content-Type"] = `multipart/form-data`;
export default instance;