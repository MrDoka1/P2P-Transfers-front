import axios from "axios";


export const API_URL = 'http://localhost:8080/api'
const clientUrl = "http://localhost:3000"

const $hostPublic = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    origin: clientUrl,
    credentials: 'include',
})

const $hostAuth = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    origin: clientUrl,
    credentials: 'include'
})

$hostAuth.interceptors.request.use((config)=>{
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config
})


export {
    $hostPublic,
    $hostAuth
}