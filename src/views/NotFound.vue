<template>
  <div class="col-full">
    <h1>Page not found!</h1>
    <router-link :to="{ name: 'Home' }">Read some cool threads</router-link>
  </div>
</template>

<script>
export default {
  name: "PageNotFound",

  created() {
    this.$emit("ready");
  },
};
</script>

<style scoped></style>
