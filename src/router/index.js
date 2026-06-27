// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/',              name: 'home',          component: () => import('../HomeView.vue') },
  { path: '/reports',       name: 'reports',       component: () => import('@/views/ReportsView.vue') },
  { path: '/reports/:id',   name: 'report-detail', component: () => import('@/views/ReportDetailView.vue') },
  { path: '/map',           name: 'map',           component: () => import('@/views/MapView.vue') },
  { path: '/login',         name: 'login',         component: () => import('@/views/LoginView.vue') },
  { path: '/register',      name: 'register',      component: () => import('@/views/RegisterView.vue') },
  { path: '/new-report',    name: 'new-report',    component: () => import('@/views/NewReportView.vue'),  meta: { requiresAuth: true } },
  { path: '/my-reports',    name: 'my-reports',    component: () => import('@/views/MyReportsView.vue'),  meta: { requiresAuth: true } },
  { path: '/profile',       name: 'profile',       component: () => import('@/views/ProfileView.vue'),    meta: { requiresAuth: true } },
  { path: '/admin',         name: 'admin',         component: () => import('@/views/AdminView.vue'),      meta: { requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// router.beforeEach((to) => {
//   const auth = useAuthStore()
//   if (to.meta.requiresAuth  && !auth.isLoggedIn) return { name: 'login', query: { next: to.path } }
//   if (to.meta.requiresAdmin && !auth.isAdmin)    return { name: 'login' }
// })
router.beforeEach((to) => {
  const auth = useAuthStore()
  
  console.log('Guard check:', { 
    path: to.path, 
    isLoggedIn: auth.isLoggedIn, 
    isAdmin: auth.isAdmin,
    user: auth.user 
  })
  
  if (to.meta.requiresAuth  && !auth.isLoggedIn) return { name: 'login', query: { next: to.path } }
  if (to.meta.requiresAdmin && !auth.isAdmin)    return { name: 'login' }
})

export default router