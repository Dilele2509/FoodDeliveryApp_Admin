//Layouts
import { AdminDefault, Blank} from "../components/Layout";

//Pages
import LoginPage from "../pages/Login";
import ForgotPass from "../pages/Login/forgotPass";
import ResetPass from "../pages/Login/ResetPassword";
import SignUp from "../pages/SignUp";

//Admin pages
import {AdminHome, Category, AdminProduct, Users, Feedback, Orders, OrderDetailAdmin, AdminProfile} from '../pages/Admin';
// Public routes
const publicRoutes = [
    {path: '/', component: LoginPage, layout: Blank},
    {path: 'forgot-pass', component: ForgotPass, layout: Blank},
    {path: 'reset-pass', component: ResetPass, layout: Blank},
    {path: '/sign-up', component: SignUp, layout: Blank},
]

// Private routes
const privateRoutes = [
    {path: '/', component: AdminHome, layout: AdminDefault},
    {path: '/user', component: Users, layout: AdminDefault},
    {path: '/category', component: Category, layout: AdminDefault},
    {path: '/product', component: AdminProduct, layout: AdminDefault},
    {path: '/order', component: Orders, layout: AdminDefault},
    {path: '/order/detail', component: OrderDetailAdmin, layout: AdminDefault},
    {path: '/feedback', component: Feedback, layout: AdminDefault},
    {path: '/admin-profile', component: AdminProfile, layout: AdminDefault}
]

export {publicRoutes, privateRoutes}