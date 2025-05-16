import { createRouter, createWebHistory } from 'vue-router'
import adminRouter from './adminRouter';
import Home from '../veiws/Home.vue';

const routes = [
    ...adminRouter.options.routes,
    {
        path: '/',
        redirect: () => {
            try {
                const token = localStorage.getItem('token');
                return token ? '/admin/dashboard' : '/admin/login';
            } catch (error) {
                console.error('Error accessing localStorage:', error);
                return '/admin/login';
            }
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: () => {
            try {
                const token = localStorage.getItem('token');
                return token ? '/admin/dashboard' : '/admin/login';
            } catch (error) {
                console.error('Error accessing localStorage:', error);
                return '/admin/login';
            }
        },
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...routes, ...adminRouter.options.routes]
});

router.beforeEach((to, _from, next) => {
    try {
        const token = localStorage.getItem('token');
        if (to.meta.requiresAuth && !token) {
            next('/admin/login');
        } else {
            next();
        }
    } catch (error) {
        console.error('Error accessing localStorage:', error);
        next('/admin/login');
    }
});

export default router;