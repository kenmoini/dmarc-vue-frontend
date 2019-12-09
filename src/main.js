import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
  
import VueKeycloakJs from '@dsb-norge/vue-keycloak-js'

import 'bootstrap'

Vue.config.productionTip = false

/*
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

*/

Vue.use(VueKeycloakJs, {
  init: {
    // Use 'login-required' to always require authentication
    // If using 'login-required', there is no need for the router guards in router.js
    onLoad: 'check-sso'
  },
  config: {
    url: process.env.VUE_APP_SSO_URL,
    clientId: process.env.VUE_APP_SSO_CLIENT_ID,
    resource: process.env.VUE_APP_SSO_CLIENT_ID,
    realm: process.env.VUE_APP_SSO_REALM,
    "ssl-required": "external",
    "public-client": true,
    logoutRedirectUri: window.location.origin
  },
  onReady: (keycloak) => {
        
    store.dispatch('login', {
      keycloakReturn: keycloak
    })
    new Vue({
      router,
      store,
      keycloak,
      created () {

        const userString = localStorage.getItem('user')

        if (userString != 'undefined') {
          const userData = JSON.parse(userString)
          
          if (userData) {
            if (userData.authenticated) { 
              store.dispatch('login', {
                keycloakReturn: userData
              })
            }
          }
        }
      },
      render: h => h(App)
    }).$mount('#app')
  },
  onInitError: (err) => {
    /* eslint-disable-next-line */
    console.log(err);
  }
})