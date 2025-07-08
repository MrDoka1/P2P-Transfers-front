import {$hostAuth, $hostPublic} from "./index";



export const registration = async (dataFetch) => {
    const {data} = await $hostPublic.post("/auth/register", dataFetch);
    localStorage.setItem("token", data?.jwt)
    return data;
}

export const login = async (dataFetch) => {
    const {data} = await $hostPublic.post("/auth/login", dataFetch);
    localStorage.setItem("token", data?.jwt)
    return data;
}

export const getUser = async () => {
    const {data} = await $hostAuth.get("/users");
    return data;
}

export const refresh = async () => {
    const {data} = await $hostAuth.get("/auth/refresh");
    localStorage.setItem("token", data?.jwt)
    return data;
}