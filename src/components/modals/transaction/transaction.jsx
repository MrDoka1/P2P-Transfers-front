import React, {useEffect, useState} from 'react';
import styles from './transaction.module.scss';
import {getAccountFullName} from "../../../http/accountAPI";
import {transactionCancel, transactionConfirm, transactionCreate} from "../../../http/transactionAPI";
import {toast} from "sonner";

const TransactionModal = ({visible, setVisible, sourceAccountNumber, update}) => {

    const [form, setForm] = useState({recipientAccountNumber: "", amount: null});
    const [recipient, setRecipient] = useState("");
    const [transaction, setTransaction] = useState(null);
    useEffect(() => {
        const id = form.recipientAccountNumber

        if (id?.length === 20){
            getAccountFullName(id).then(data => {
                setRecipient(data?.fio)
            })
        }else{
            setRecipient("")
        }
    }, [form.recipientAccountNumber]);

    const createTransaction = async () => {
        try {
            if (!form.amount) {
                toast.error("Заполните поле сумма");
                return;
            }

            const parsedAmount = parseFloat(form.amount.replace(',', '.'));
            if (isNaN(parsedAmount)) {
                toast.error("Некорректный ввод суммы");
                return;
            }

            const amountInKopecks = Math.round(parsedAmount * 100);

            if (recipient === "") {
                toast.error("Счет не найден");
                return;
            }

            const data = await transactionCreate({
                sourceAccountNumber,
                amount: amountInKopecks,
                recipientAccountNumber: form.recipientAccountNumber
            });

            setTransaction(data?.id);
        } catch (err) {
            const { status } = err;
            switch (status) {
                case 400:
                    toast.error("Недостаточно средств");
                    break;
                default:
                    toast.error("Ошибка при создании транзакции");
            }
        }
    }


    return (
        <div className={visible ? [styles.wrapper, styles.wrapperActive].join(" ") : styles.wrapper} onClick={() => {
            setVisible({sourceAccountNumber, visible: false})
            setForm({recipientAccountNumber: "", amount: ""})
        }
        }>

                <div className={styles.body} onClick={(e)=> e.stopPropagation()}>
                    {transaction
                        ?
                        <>
                            <div className={styles.title}>Подтвердить транзакцию</div>
                            <button
                                onClick={()=>{
                                    transactionConfirm(transaction).finally(()=>{
                                        setTransaction(null)
                                        setRecipient("")
                                        setVisible({sourceAccountNumber, visible: false})
                                        setForm({recipientAccountNumber: "", amount: ""})
                                        update()
                                        toast.success("Транзакция проведена")

                                    })
                                }}
                            >Создать</button>
                            <button
                                onClick={()=>{
                                    transactionCancel(transaction).finally(()=>{
                                        setTransaction(null)
                                        setRecipient("")
                                        setVisible({sourceAccountNumber, visible: false})
                                        setForm({recipientAccountNumber: "", amount: ""})
                                        toast.success("Транзакция отменена")
                                    })
                                }}
                                className={styles.close}>Отменить</button>
                        </>
                        :<>
                            <div className={styles.title}>Создать транзакцию</div>
                            <input
                                type="text"
                                placeholder={"Номер счета"}
                                value={form.recipientAccountNumber}
                                maxLength={20}
                                onChange={(e)=> setForm({...form, recipientAccountNumber: e.target.value})}
                            />
                            <div className={styles.recipient}>{recipient}</div>
                            <input
                                type="text"
                                placeholder={"Сумма"}
                                value={form.amount}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(',', '.');
                                    // Не даём ввести более 2 знаков после запятой
                                    if (/^\d*([.,]\d{0,2})?$/.test(raw)) {
                                        setForm({...form, amount: raw});
                                    }
                                }}
                            />
                            <button onClick={createTransaction}>Создать</button>
                        </>
                    }
                </div>
        </div>
    );
};

export default TransactionModal;