import {$hostAuth} from "./index";


export const getAllAccounts = async () => {
    const {data} = await $hostAuth.get("/accounts/active");
    return data;
}

export const createAccounts = async (dataFetch) => {
    const {data} = await $hostAuth.post("/accounts", dataFetch);
    return data;
}

export const deleteAccounts = async (id) => {
    const {data} = await $hostAuth.patch(`/accounts/close/${id}`);
    return data;
}

export const getAccountFullName = async (id) => {
    const {data} = await $hostAuth.get(`/accounts/number/${id}/fullname`);
    return data;
}