import './style/app.scss';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {toast, Toaster} from "sonner";
import React, {useContext, useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {getUser, refresh} from "./http/userAPI";
import Preloader from "./components/preloader/preloader";

const App = observer( ()=> {

    const {user} = useContext(Context);
    const [loading, setLoading] = useState(true);

    const check = async () =>{
        try{
            const data = await getUser()
            await refresh()
            user.setUser(data);
            user.setIsAuth(true);
        }catch(err){
            const {status} = err;
            switch (status) {
                case 403:
                    toast.error('Пользователь не вошел в аккаунт');
                    break;
                default:
                    toast.error('Попробуйте позже');
            }
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        check()
    }, [])

    if (loading) {
        return <Preloader/>
    }

    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                richColors={false}
                unstyled
                className="z-[9999]"
                toastOptions={{
                    classNames: {
                        toast: 'custom-toast',
                        error: 'custom-toast custom-toast-error',
                    },
                }}
            />
            <AppRouter />
        </BrowserRouter>
    );
});

export default App;
