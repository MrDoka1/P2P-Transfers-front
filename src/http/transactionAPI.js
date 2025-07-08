import {$hostAuth} from "./index";

export const transactionCreate = async (dataFetch) => {
    const {data} = await $hostAuth.post("/transactions", dataFetch);
    return data;
}

export const transactionCancel = async (id) => {
    const {data} = await $hostAuth.patch(`/transactions/${id}/cancel`);
    return data;
}

export const transactionConfirm = async (id) => {
    const {data} = await $hostAuth.patch(`/transactions/${id}/confirm`);
    return data;
}