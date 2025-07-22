import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../view/home.vue')
    },
    {
        path: '/production',
        name: 'production',
        component: () => import('../view/production.vue')
    },
    {
        path: '/sales',
        name: 'sales',
        component: () => import('../view/sales.vue')
    },
    {
        path: '/monitor',
        name: 'monitor',
        title: '林业实时环境监测',
        component: () => import('../view/monitor.vue')
    },
    {
        path: '/prediction',
        name: 'prediction',
        title: '预测',
        component: () => import('../view/prediction.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
