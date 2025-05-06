import { createRouter, createWebHistory } from 'vue-router'
import Login from '../auth/Login.vue';
import Sigin from '../auth/Sigin.vue'
import Dashboard from '../veiws/Dashboard.vue';
import User from '../components/User.vue';

const routes = [
    {
        path: '/admin/login',
        name: 'admin-login',
        component: Login,
        meta: { layout: 'auth' }, // Auth layout
    },
    {
        path: '/admin/signup',
        name: 'admin-signup',
        component: Sigin,
        meta: { layout: 'auth' }, // Auth layout
    },
    {
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        component: Dashboard,
        meta: { layout: 'dashboard', requiresAuth: true }, // Dashboard layout
    },
    {
        path: '/admin/users',
        name: 'admin-users',
        component: User,
        meta: { layout: 'dashboard', requiresAuth: true }, // Dashboard layout
    },

];

const adminRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default adminRouter;