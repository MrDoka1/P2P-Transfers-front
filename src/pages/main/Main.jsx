import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import style from './Main.module.scss'
import {Context} from "../../index";
import {createAccounts, deleteAccounts, getAllAccounts} from "../../http/accountAPI";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import TransactionModal from "../../components/modals/transaction/transaction";
import {Login_Page} from "../../utils/pageUrls";

const MainPage = observer(() => {

    const {user} = useContext(Context);
    const [popup, setPopup] = useState({visible: false, sourceAccountNumber: null});

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onError = (errors) => {
        if (errors.name) {
            toast.error(errors.name.message);
        } else if (errors.balance) {
            toast.error(errors.balance.message);
        } else if (errors.recipientAccountNumber) {
            toast.error(errors.recipientAccountNumber.message);
        }
    };



    const onSubmit = async (data) => {
        try{
            createAccounts(data).finally(()=>{
                reset()
                getAllAccounts().then((accounts) => {
                    setAccounts(accounts);
                    toast.success("Счет создан");
                })
            })
        }catch (e) {
            console.log(e)
        }
    }
    const [accounts, setAccounts] = useState([]);

    const onDelete = (id) => {
        try {
            deleteAccounts(id).finally(()=>{
                getAllAccounts().then((accounts) => {
                    setAccounts(accounts);
                    toast.success("Счет закрыт");
                })

            })

        }catch (e) {
            console.log(e)
        }
    }
    const updateAccounts = () => {
        getAllAccounts().then((accounts) => {
            setAccounts(accounts);
        })
    }
    useEffect(() => {
        updateAccounts()
    }, [])

    const saveToBuffer = async (text) =>{
        await navigator.clipboard.writeText(text);
        toast.success("Номер счета скопирован")
    }
    return (
        <div className="page">
            <div className="page_container">
                <div className={style.page}>
                    <div className={style.container}>
                        <TransactionModal visible={popup.visible} setVisible={setPopup} sourceAccountNumber={popup.sourceAccountNumber} update={updateAccounts}/>
                        <div className={style.header}>
                            <div className={style.welcome}>Добро пожаловать, {user.user?.firstName} {user.user?.middleName}</div>
                            <button className={style.logout} onClick={() => {
                                localStorage.removeItem("token")
                                window.location.replace(Login_Page);
                            }}>
                                <svg width="20" height="20" viewBox="0 0 584 584" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M292 558.667C144.724 558.667 25.3334 439.277 25.3334 292C25.3334 144.724 144.724 25.3333 292 25.3333" stroke="#FF4B4B" strokeWidth="50" strokeLinecap="round" />
                                    <path d="M225.333 292H558.667M558.667 292L458.667 192M558.667 292L458.667 392" stroke="#FF4B4B" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <div className={style.body}>
                            <div className={style.accounts}>
                                <div className={style.accounts__title}>Ваши счета</div>
                                <div className={style.accounts__items}>
                                    {
                                        accounts?.length > 0 && accounts.map(account =>
                                            <div key={account.id} className={style.accounts__item}>
                                                <div className={style.account__info}>{account?.accountNumber} - {account?.name}</div>
                                                <div className={style.accounts__balance}>{(account?.balance / 100).toFixed(2)} руб.</div>
                                                <div className={style.accounts__actions}>
                                                    <button className={style.accounts__send} onClick={()=> setPopup({visible: true, sourceAccountNumber: account?.accountNumber})}>
                                                        Отправить
                                                    </button>
                                                    <button className={style.accounts__copy} onClick={()=>saveToBuffer(account?.accountNumber)}>
                                                        <svg width="18" height="18" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g clipPath="url(#clip0_288_100)">
                                                                <path d="M655.556 155.556H233.333C224.493 155.556 216.014 159.067 209.763 165.319C203.512 171.57 200 180.048 200 188.889V722.222C200 731.063 203.512 739.541 209.763 745.792C216.014 752.044 224.493 755.556 233.333 755.556H655.556C664.396 755.556 672.875 752.044 679.126 745.792C685.377 739.541 688.889 731.063 688.889 722.222V188.889C688.889 180.048 685.377 171.57 679.126 165.319C672.875 159.067 664.396 155.556 655.556 155.556ZM644.444 711.111H244.444V200H644.444V711.111Z" fill="#208E67" />
                                                                <path d="M577.778 77.7778C577.778 68.9372 574.266 60.4588 568.014 54.2076C561.763 47.9564 553.285 44.4445 544.444 44.4445H122.222C113.381 44.4445 104.903 47.9564 98.6518 54.2076C92.4006 60.4588 88.8887 68.9372 88.8887 77.7778V611.111C88.8887 619.952 92.4006 628.43 98.6518 634.681C104.903 640.933 113.381 644.444 122.222 644.444H133.333V88.8889H577.778V77.7778Z" fill="#208E67" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_288_100">
                                                                    <rect width="800" height="800" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    </button>
                                                    <button className={style.accounts__delete} onClick={()=>onDelete(account?.accountNumber)}>
                                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M7.2 3.6H10.8C10.8 3.12261 10.6104 2.66477 10.2728 2.32721C9.93523 1.98964 9.47739 1.8 9 1.8C8.52261 1.8 8.06477 1.98964 7.72721 2.32721C7.38964 2.66477 7.2 3.12261 7.2 3.6ZM5.4 3.6C5.4 2.64522 5.77928 1.72955 6.45442 1.05442C7.12955 0.379285 8.04522 0 9 0C9.95478 0 10.8705 0.379285 11.5456 1.05442C12.2207 1.72955 12.6 2.64522 12.6 3.6H17.1C17.3387 3.6 17.5676 3.69482 17.7364 3.8636C17.9052 4.03239 18 4.2613 18 4.5C18 4.73869 17.9052 4.96761 17.7364 5.1364C17.5676 5.30518 17.3387 5.4 17.1 5.4H16.3062L15.5088 14.706C15.4321 15.6046 15.021 16.4417 14.3567 17.0517C13.6924 17.6617 12.8233 18.0001 11.9214 18H6.0786C5.17672 18.0001 4.30765 17.6617 3.64333 17.0517C2.97902 16.4417 2.56786 15.6046 2.4912 14.706L1.6938 5.4H0.9C0.661305 5.4 0.432387 5.30518 0.263604 5.1364C0.0948211 4.96761 0 4.73869 0 4.5C0 4.2613 0.0948211 4.03239 0.263604 3.8636C0.432387 3.69482 0.661305 3.6 0.9 3.6H5.4ZM11.7 9C11.7 8.7613 11.6052 8.53239 11.4364 8.3636C11.2676 8.19482 11.0387 8.1 10.8 8.1C10.5613 8.1 10.3324 8.19482 10.1636 8.3636C9.99482 8.53239 9.9 8.7613 9.9 9V12.6C9.9 12.8387 9.99482 13.0676 10.1636 13.2364C10.3324 13.4052 10.5613 13.5 10.8 13.5C11.0387 13.5 11.2676 13.4052 11.4364 13.2364C11.6052 13.0676 11.7 12.8387 11.7 12.6V9ZM7.2 8.1C6.96131 8.1 6.73239 8.19482 6.5636 8.3636C6.39482 8.53239 6.3 8.7613 6.3 9V12.6C6.3 12.8387 6.39482 13.0676 6.5636 13.2364C6.73239 13.4052 6.96131 13.5 7.2 13.5C7.43869 13.5 7.66761 13.4052 7.8364 13.2364C8.00518 13.0676 8.1 12.8387 8.1 12.6V9C8.1 8.7613 8.00518 8.53239 7.8364 8.3636C7.66761 8.19482 7.43869 8.1 7.2 8.1Z" fill="#B64B4B" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <form onSubmit={handleSubmit(onSubmit, onError)} className={style.accounts__create}>
                                    <h3>Создать новый счет</h3>
                                    <input
                                        type="text"
                                        placeholder={"Название счета"}
                                        {...register('name', {
                                            required: 'Введите название счета',
                                        })}
                                    />

                                    <input
                                        type="text"
                                        placeholder={"Баланс"}
                                        {...register('balance', {
                                            required: 'Введите баланс счета',
                                        })}
                                    />

                                    <button type="submit">Создать счет</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default MainPage;