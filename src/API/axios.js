import axios from 'axios';

const BASE_URL = "http://192.168.1.62:3001/api/"

export default axios.create({
    baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials:true
});