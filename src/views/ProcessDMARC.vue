<template>
  <div class="processDMARC">
    <h1>Process DMARC Bundle</h1>
    <p class="lead"><em>This page allows you to upload a DMARC report bundle file and have the results displayed in a series of charts and tables.</em></p>

    <div class="row mb-5">
      <div class="col-sm">
        <button @click="testGateway" class="btn btn-primary float-right">Test Gateway</button>
        <p>
          <strong>Test API Gateway Connection</strong><br />
          <span>{{ gatewayRes }}</span>
        </p>
        <hr class="mt-5" />
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-sm">
        <p>
          <strong>Upload Bundle</strong><br />
          <span>{{ uploadBundleRes }}</span>
        </p>
        <form @submit.prevent="submitFile">
            <label>File
              <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </label>
            <input type="submit" value="Submit" />
        </form>
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
      uploadBundleRes: ''
    }
  },
  methods: {
    handleFileUpload () {
      this.file = this.$refs.file.files[0];
    },
    testGateway () {
      var self = this
      axios.get( process.env.VUE_APP_API_GATEWAY + '/healthz', {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      }).then(function(response){
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
    submitFile () {
      let formData = new FormData()
      formData.append('file', this.file)
      axios.post( process.env.VUE_APP_API_GATEWAY + '/testjwt',
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data'
          },
          crossdomain: true
        }
      ).then(function(){
        /* eslint-disable-next-line */
        console.log('SUCCESS!!');
      })
      .catch(function(){
        /* eslint-disable-next-line */
        console.log('FAILURE!!');
      });
    }
  }
}
</script>

<style scoped lang="scss">

</style>