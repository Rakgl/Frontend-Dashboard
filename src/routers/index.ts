import { createRouter, createWebHistory } from 'vue-router'
import adminRouter from './adminRouter';

const routes = [
    ...adminRouter.options.routes,
    {
        path: '/',
        redirect: () => {
            try {
                const token = localStorage.getItem('token');
                return token ? '/dashboard' : '/login';
            } catch (error) {
                console.error('Error accessing localStorage:', error);
                return '/login';
            }
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: () => {
            try {
                const token = localStorage.getItem('token');
                return token ? '/dashboard' : '/login';
            } catch (error) {
                console.error('Error accessing localStorage:', error);
                return '/login';
            }
        },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach((to, _from, next) => {
    try {
        const token = localStorage.getItem('token');
        if (to.meta.requiresAuth && !token) {
            next('/login');
        } else {
            next();
        }
    } catch (error) {
        console.error('Error accessing localStorage:', error);
        next('/login');
    }
});

export default router;