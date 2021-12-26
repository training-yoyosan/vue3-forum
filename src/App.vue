<template>
  <the-navbar />
  <div class="container">
    <router-view v-show="showPage" @ready="showPage = true" />
    <AppSpinner v-show="!showPage" />
  </div>
</template>

<style>
@import "assets/style.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
import TheNavbar from "@/components/TheNavbar";
import { mapActions } from "vuex";
import AppSpinner from "@/components/AppSpinner";

export default {
  components: { AppSpinner, TheNavbar },

  data() {
    return {
      showPage: false,
    };
  },

  methods: {
    ...mapActions(["fetchAuthUser"]),
  },

  created() {
    this.fetchAuthUser();

    this.$router.beforeEach(() => {
      this.showPage = false;
    });
  },
};
</script>
