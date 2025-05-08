import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/mix',
                    name: 'Mix',
                    component: () => import('../views/Mix/MixView.vue')
                },
                {
                    path: '/mix/add',
                    name: 'Mix Add',
                    component: () => import('../components/MixComponents/AddMix.vue')
                },
                {
                    path: '/edit-mix/:id',
                    name: 'Mix Edit By Id',
                    component: () => import('../components/MixComponents/EditMixById.vue')
                },
                {
                    path: '/mix/:slug',
                    name: 'Mix Id View',
                    component: () => import('../views/Mix/MixSlug/MixSlugView.vue')
                },
                {
                    path: '/barn',
                    name: 'barn',
                    component: () => import('../views/Barn/BarnView.vue')
                },
                {
                    path: '/barn/product/:id',
                    name: 'ProductId',
                    component: () => import('../views/Barn/BarnProductIdView.vue')
                },
                {
                    path: '/admin',
                    name: 'admin',
                    component: () => import('../views/admins/AdminView.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
