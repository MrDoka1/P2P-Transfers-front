import React, {useContext, useEffect, useState} from 'react';
import { motion } from "framer-motion";
import styles from "./Login.module.scss"
import {Link, useNavigate} from "react-router-dom";
import {Login_Page, Main_Page, Registration_Page} from "../../utils/pageUrls";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {login} from "../../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
const LoginPage = observer(() => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const {user} = useContext(Context);

    const onSubmit = async (dataFetch) => {
        try{
            const data = await login(dataFetch)
            toast.success('Успешная авторизация!');
            user.setIsAuth(true)
            user.setUser(data)
            window.location.replace(Main_Page);
        }catch(err){
            const {status} = err;
            switch (status) {
                case 401:
                    toast.error('Неверный email или пароль');
                    break;
                default:
                    toast.error('Попробуйте позже');
            }
        }

    };

    const onError = (errors) => {
        if (errors.email) {
            toast.error(errors.email.message);
        } else if (errors.password) {
            toast.error(errors.password.message);
        }
    };

    return (
        <div className={styles.loginPage}>

            <motion.div
                className={styles.loginLeft}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            >
                <motion.div
                    className={styles.leftBackground}
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

            </motion.div>

            <motion.div
                className={styles.loginRight}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
            >
                <h2>P2P <span>TRANSACTION</span></h2>
                <form onSubmit={handleSubmit(onSubmit, onError)} className={styles.loginForm}>
                    <p>Добро пожаловать</p>
                    <div className={styles.formText}>Пожалуйста авторизуйтесь для входа в систему</div>
                    <input
                        type="email"
                        placeholder="Ваш e-mail"
                        {...register('email', {
                            required: 'Email обязателен',
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Некорректный email',
                            },
                        })}
                    />
                    <input
                        type="password"
                        placeholder="Ваш пароль"
                        {...register('password', {
                            required: 'Пароль обязателен',
                            minLength: {
                                value: 8,
                                message: 'Пароль минимум 8 символов',
                            },
                        })}
                    />
                    <div className={styles.row}>
                        <button type="submit">Войти</button>
                        <div className={styles.forgotPassword}>
                            <Link to={Registration_Page}>Нет аккаунта?</Link>
                        </div>
                    </div>

                </form>
            </motion.div>
        </div>
    );
});

export default LoginPage;