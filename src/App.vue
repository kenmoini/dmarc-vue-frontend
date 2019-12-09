<template>
  <div id="app" class="container">
    <div class="row">
      <div class="col-sm-12 col-md-10 offset-md-1 mt-5 mb-5">
        <div id="nav w-100">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link> | 
          <router-link to="/process-dmarc">Process DMARC</router-link>
          <button class="btn btn-warning float-right" @click="processLogout" v-if="loggedIn">Log out</button>
          <button class="btn btn-success float-right" @click="$keycloak.loginFn" v-if="!loggedIn">Log In</button>
          <button class="btn btn-primary float-right mr-2" @click="$keycloak.register" v-if="!loggedIn">Register</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-10 offset-md-1">
        <router-view/>
      </div>
    </div>
  </div>
</template>


<style lang="scss">

@import './assets/styles/custom.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';

</style>

<script>
import { authComputed } from './store/helpers.js'

export default {
  computed: {
    ...authComputed
  },
  methods: {
    processLogout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>