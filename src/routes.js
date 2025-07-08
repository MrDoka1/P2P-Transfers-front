import Login from "./pages/login/Login";
import Registration from "./pages/registration/Registration";
import Main from "./pages/main/Main";
import {Login_Page, Main_Page, Registration_Page} from "./utils/pageUrls";

export const authRoutes = [
    {
        path: Main_Page,
        Component: Main
    },
    {
        path: '*',
        Component: Main
    }
]

export const publicRoutes = [
    {
        path: Login_Page,
        Component: Login
    },{
        path: Registration_Page,
        Component: Registration
    },
    {
        path: '*',
        Component: Login
    }
]