import { createRouter, createWebHistory } from 'vue-router'
import Login from '../auth/Login.vue';
import Sigin from '../auth/Sigin.vue';
import User from '../veiws/user/User.vue';
import userDetail from '../veiws/user/userDetail.vue';
import Create from '../veiws/user/create.vue';
import Update from '../veiws/user/update.vue';
import Chart from '../veiws/chart/chart.vue';
import Attendant from '../veiws/attendant/attendant.vue';
import Dashboard from '../veiws/dashboard/dashboard.vue';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { layout: 'auth' }, // Auth layout
    },
    {
        path: '/signup',
        name: 'signup',
        component: Sigin,
        meta: { layout: 'auth' }, // Auth layout
    },
    {
        path: '/chart',
        name: 'chart',
        component: Chart,
        meta: { layout: 'dashboard', requiresAuth: true }, // Dashboard layout
    },
    {
        path: '/users',
        name: 'users',
        component: User,
        meta: { layout: 'dashboard', requiresAuth: true },
    },
    {
        path: '/detail-user/:id',
        name: 'userDetail',
        component: userDetail,
        meta: { layout: 'dashboard', requiresAuth: true },
    },
    {
        path: '/create-user',
        name: 'create-user',
        component: Create,
        meta: { layout: 'dashboard', requiresAuth: true },
    },
    {
        path: '/update-user/:id',
        name: 'update-user',
        component: Update,
        meta: { layout: 'dashboard', requiresAuth: true },
    },
    {
        path: '/attendant',
        name: 'attendant',
        component: Attendant,
        meta: { layout: 'dashboard', requiresAuth: true },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { layout: 'dashboard', requiresAuth: true },
    },
];

const adminRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default adminRouter;