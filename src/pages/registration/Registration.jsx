import React, {useState} from 'react';
import styles from "./Registration.module.scss"
import {motion} from "framer-motion";
import {Link, useNavigate} from "react-router-dom";
import {Login_Page} from "../../utils/pageUrls";
import {useForm} from "react-hook-form";
import {toast} from "sonner";
import {registration} from "../../http/userAPI";
const RegistrationPage = () => {

    const [step, setStep] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (step === 0){
            setStep(1);
            return
        }
        await registration(data);
        toast.success('Регистрация прошла успешно!');
        navigate(Login_Page);
    };

    const onError = () => {
        if (errors.email){
            toast.error(errors.email.message);
        } else if (errors.password) {
            toast.error(errors.password.message);
        } else if (errors.confirmPassword) {
            toast.error(errors.confirmPassword.message);
        } else if (errors.firstName){
            toast.error(errors.firstName.message);
        } else if (errors.lastName){
            toast.error(errors.lastName.message);
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
                    <div className={styles.formText}>Пожалуйста заполните форму для регистрации</div>
                    {step === 0 &&
                        <>
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
                                    required: 'Введите пароль',
                                    minLength: {
                                        value: 8,
                                        message: 'Минимум 8 символов',
                                    },
                                })}
                            />

                            <input
                                type="password"
                                placeholder="Повторите пароль"
                                {...register('confirmPassword', {
                                    required: 'Повторите пароль',
                                    validate: (value) =>
                                        value === password || 'Пароли не совпадают',
                                })}
                            />
                        </>
                    }
                    {step === 1 &&
                        <>
                            <input
                                type="text"
                                placeholder="Имя"
                                {...register('firstName', {
                                    required: 'Введите имя',
                                })}
                            />
                            <input
                                type="text"
                                placeholder="Фамилию"
                                {...register('lastName', {
                                    required: 'Введите фамилию',
                                })}
                            />
                            <input
                                type="text"
                                placeholder="Отчество"
                                {...register('middleName')}
                            />
                        </>
                    }


                    <div className={styles.row}>
                        {
                            step === 0 ?
                                <button type="submit">Далее</button>
                                :
                                <button type="submit" style={{width: "150px"}}>Регистрация</button>
                        }

                        <div className={styles.forgotPassword}>
                            <Link to={Login_Page}>Есть аккаунт?</Link>
                        </div>
                    </div>

                </form>
            </motion.div>
        </div>
    );
};

export default RegistrationPage;