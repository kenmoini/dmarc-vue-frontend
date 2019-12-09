<template>
  <div class="hello">
    <div class="jumbotron">
      <h1 class="display-4">DMARCr</h1>
      <p class="lead">The hottest new email security analysis and reporting app</p>
      <hr class="my-4">
      <p>Email is hard.  Scanning, Spam filters, SPF, DKIM, DMARC, DNS, the list goes on.  This service allows you to decode those funny DMARC Reports emailed to your domain administrator.</p>
      <p class="lead">
        <router-link to="/process-dmarc" class="btn btn-primary">Process DMARC</router-link>
        <router-link to="/about" class="btn btn-secondary ml-2">About</router-link>
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {
  }
}
</script>
