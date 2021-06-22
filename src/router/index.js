import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/Home');
const Login = () => import('../views/Login');
const Register = () => import('../views/Register');
const SubmitTopic = () => import('../views/SubmitTopic');
const Topic = () => import('../views/Topic');
const Notice = () => import('../views/Notice');

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/toLogin',
        component: Login
    },
    {
        path: '/toRegister',
        component: Register
    },
    {
        path: '/toSubmitTopic',
        component: SubmitTopic
    },
    {
        path: '/toNotice',
        component: Notice
    },
    {
        path: '/toTopic',
        component: Topic
    },
    {
        path: '/about',
        name: 'about',
    },
]

const router = new VueRouter({
    //mode: 'history',
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
