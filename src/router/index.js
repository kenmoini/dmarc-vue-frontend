import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
//import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/status',
    name: 'status',
    component: () => import(/* webpackChunkName: "status" */ '../views/Status.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/process-dmarc',
    name: 'process-dmarc',
    component: () => import(/* webpackChunkName: "process-dmarc" */ '../views/ProcessDMARC.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (Vue.prototype.$keycloak.authenticated) {
    // if (store.state.user.authenticated) {
      next()
    } else {
      const loginUrl = Vue.prototype.$keycloak.createLoginUrl({ redirectUri: window.location.origin + to.fullPath })
      window.location.replace(loginUrl)
    }
  } else {
    next()
  }
})

export default router
