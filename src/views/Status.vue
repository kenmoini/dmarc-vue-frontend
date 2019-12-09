<template>
  <div class="status">
    <h1>This is the Status page</h1>

    <p>
       <strong>Local Storage - String</strong>
       <br />
       <code>
            {{ localStorageString }}
       </code>
    </p>
    <p>
       <strong>Local Storage - Object</strong>
       <br />
       <pre>
{{ localStorageObject }}
       </pre>
    </p>
    <p>
       <strong>Keycloak Object</strong>
       <br />
       <pre>
{{ keycloakObject }}
       </pre>
    </p>
    <p>
       <strong>VueX Store</strong>
       <br />
       <pre>
{{ vueXStore }}
       </pre>
    </p>
  </div>
</template>

<script>

import router from '../router'
import { inspect } from 'util' // or directly

const localStorageString = localStorage.getItem('user')
var localStorageObject
if (localStorageString != 'undefined') {
    localStorageObject = JSON.parse(localStorageString)
}

export default {
    data() {
        return {
            localStorageString: localStorageString,
            localStorageObject: localStorageObject,
            keycloakObject: inspect(router.app.$keycloak._data.authenticated),
            vueXStore: inspect(router.app.$store)
        }
    }
}
</script>