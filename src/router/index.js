import { createRouter, createWebHistory } from 'vue-router'
import AdminLogin from '../views/AdminLogin.vue'
import AdminReview from '../views/AdminReview.vue'

const routes = [
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: AdminLogin
    },
    {
        path: '/admin/review',
        name: 'AdminReview',
        component: AdminReview,
        meta: { requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/admin/login'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        // 判断 localStorage 是否有 token
        const token = localStorage.getItem('admin_token')
        if (token) {
            next()
        } else {
            next('/admin/login')
        }
    } else {
        next()
    }
})

export default router