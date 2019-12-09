<template>
  <div class="processDMARC">
    <h1>Process DMARC Bundle</h1>
    <p class="lead"><em>This page allows you to upload a DMARC report bundle file and have the results displayed in a series of charts and tables.</em></p>

    <div class="row mt-5 mb-5 d-none">
      <div class="col-sm">
        <button @click="testGateway" class="btn btn-primary float-right">Test Gateway</button>
        <p>
          <strong>Test API Gateway Connection</strong><br />
          <pre>{{ gatewayRes }}</pre>
        </p>
        <hr class="mt-5" />
      </div>
    </div>

    <div class="row mb-5 d-none">
      <div class="col-sm">
        <button @click="testJWT" class="btn btn-primary float-right">Test JSON Web Token</button>
        <p>
          <strong>Test API Gateway JWT Validation</strong><br />
          <pre>{{ testJWTRes }}</pre>
        </p>
        <hr class="mt-5" />
      </div>
    </div>

    <div class="row mt-5 mb-5">
      <div class="col-sm">
        <p>
          <strong>Upload Bundle</strong>
        </p>
        <form class="mb-5" @submit.prevent="submitFile">
            <input class="btn btn-primary float-right" type="submit" value="Submit" />
            <label>
              <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </label>
        </form>
        <p>
          <pre>{{ uploadBundleResError }}</pre>
        </p>
        <div id="returnedDMARCReport" v-if="uploadBundleRes">

          <p class="d-none"><pre>{{ uploadBundleRes }}</pre></p>
          
          <table class="table table-bordered table-striped table-hover">
            <tbody>
              <tr>
                <td><strong>Reporting Organization</strong></td>
                <td>{{ uploadBundleRes.reports[0].reportingOrg }}</td>
              </tr>
              <tr>
                <td><strong>Reporting Email</strong></td>
                <td>{{ uploadBundleRes.reports[0].reportingEmail }}</td>
              </tr>
              <tr>
                <td><strong>Report Date</strong></td>
                <td>{{ uploadBundleRes.reports[0].reportStartDate | formatDate }} - {{ uploadBundleRes.reports[0].reportEndDate | formatDate }}</td>
              </tr>
              <tr>
                <td><strong>Reported Domain</strong></td>
                <td>{{ uploadBundleRes.reports[0].reportedDomain }}</td>
              </tr>
              <tr>
                <td><strong>Domain RUA Email</strong></td>
                <td>{{ uploadBundleRes.reports[0].reportedDomainRUA }}</td>
              </tr>
              <tr>
                <td><strong>DMARC Policy</strong></td>
                <td v-if="uploadBundleRes.reports[0].reportedPolicy.disposition === 'none'">
                  Monitor policy, doing nothing
                </td>
                <td v-if="uploadBundleRes.reports[0].reportedPolicy.disposition === 'quarantine'">
                  Quarantine policy, marshall flagged messages
                </td>
                <td v-if="uploadBundleRes.reports[0].reportedPolicy.disposition === 'reject'">
                  Reject policy, prevent flagged messages
                </td>
              </tr>
              <tr>
                <td><strong>DKIM Policy</strong></td>
                <td v-if="uploadBundleRes.reports[0].reportedPolicy.dkim === 'r'">
                  Relaxed
                </td>
                <td v-if="uploadBundleRes.reports[0].reportedPolicy.dkim === 's'">
                  Strict
                </td>
              </tr>
              <tr>
                <td><strong>SPF Policy</strong></td>
                <td v-if="uploadBundleRes.reports[0].reportedPolicy.spf === 'r'">
                  Relaxed
                </td>
                <td v-if="uploadBundleRes.reports[0].reportedPolicy.spf === 's'">
                  Strict
                </td>
              </tr>
            </tbody>
          </table>
          <h3 class="mb-3 pb-3 mt-5">Entries</h3>
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>IP</th>
                <th>Count</th>
                <th>From</th>
                <th>Remote</th>
                <th>DKIM</th>
                <th>SPF</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in uploadBundleRes.reports[0].entries" v-bind:key="index">
                <td>{{ entry.IP }}</td>
                <td>{{ entry.Count }}</td>
                <td>{{ entry.From }}</td>
                <td>{{ entry.RFrom }}</td>
                <td>{{ entry.RDKIM }}</td>
                <td>{{ entry.RSPF }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="reportHasFailures">
            <h3 class="mt-4 mb-4">Failures found!</h3>
            <p>Would you like to send an email alert to the administrator ({{ uploadBundleRes.reports[0].reportedDomainRUA }}) of the domain ({{ uploadBundleRes.reports[0].reportedDomain }})?</p>
          </div>
        </div>
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
      reportHasFailures: false,
      testJWTRes: '',
      uploadBundleRes: '',
      uploadBundleResError: ''
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
      formData.append('bundleFile', this.file)
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
        self.uploadBundleRes = response.data

        //Loop through entries, check for failures
        //If failure found, set data, show Email form/button

      })
      .catch(function(error){
        /* eslint-disable-next-line */
        console.log('FAILURE!!', error)
        self.uploadBundleResError = error
      });
    }
  }
}
</script>

<style scoped lang="scss">

</style>