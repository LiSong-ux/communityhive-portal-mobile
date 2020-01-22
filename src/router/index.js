import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Login from '../views/Login'
import Register from '../views/Register'
import SubmitTopic from '../views/SubmitTopic'
import Topic from '../views/Topic'
import Notice from '../views/Notice'

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
