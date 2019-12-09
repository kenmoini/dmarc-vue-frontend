<template>
  <div class="processDMARC">
    <h1>Process DMARC Bundle</h1>
    <p class="lead"><em>This page allows you to upload a DMARC report bundle file and have the results displayed in a series of charts and tables.</em></p>

    <div class="row mt-5 mb-5">
      <div class="col-sm">
        <button @click="testGateway" class="btn btn-primary float-right">Test Gateway</button>
        <p>
          <strong>Test API Gateway Connection</strong><br />
          <pre>{{ gatewayRes }}</pre>
        </p>
        <hr class="mt-5" />
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-sm">
        <button @click="testJWT" class="btn btn-primary float-right">Test JSON Web Token</button>
        <p>
          <strong>Test API Gateway JWT Validation</strong><br />
          <pre>{{ testJWTRes }}</pre>
        </p>
        <hr class="mt-5" />
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-sm">
        <p>
          <strong>Upload Bundle</strong>
        </p>
        <form @submit.prevent="submitFile">
            <input class="btn btn-primary float-right" type="submit" value="Submit" />
            <label>
              <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </label>
        </form>
        <p>
          <pre>{{ uploadBundleRes }}</pre>
        </p>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  data () {
    return {
      file: '',
      gatewayRes: '',
      testJWTRes: '',
      uploadBundleRes: ''
    }
  },
  methods: {
    handleFileUpload () {
      this.file = this.$refs.file.files[0];
    },
    testGateway () {
      var self = this
      axios.get( process.env.VUE_APP_API_GATEWAY + '/healthz').then(function(response){
        /* eslint-disable-next-line */
        console.log('SUCCESS!!', response);
        self.gatewayRes = response
      })
      .catch(function(error){
        /* eslint-disable-next-line */
        console.log('FAILURE!!', error);
        self.gatewayRes = error
      });
    },
    testJWT () {
      var self = this
      axios.get( process.env.VUE_APP_API_GATEWAY + '/testjwt' ).then(function(response){
        /* eslint-disable-next-line */
        console.log('SUCCESS!!', response);
        self.testJWTRes = response
      })
      .catch(function(error){
        /* eslint-disable-next-line */
        console.log('FAILURE!!', error);
        self.testJWTRes = error
      });
    },
    submitFile () {
      var self = this
      let formData = new FormData()
      formData.append('file', this.file)
      axios.post( process.env.VUE_APP_API_GATEWAY + '/uploadDMARCBundle',
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
        }
      ).then(function(response){
        /* eslint-disable-next-line */
        console.log('SUCCESS!!', response)
        self.uploadBundleRes = response
      })
      .catch(function(error){
        /* eslint-disable-next-line */
        console.log('FAILURE!!', error)
        self.uploadBundleRes = error
      });
    }
  }
}
</script>

<style scoped lang="scss">

</style>