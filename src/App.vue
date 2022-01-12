<template>
  <the-navbar />
  <div class="container">
    <!-- See why use `:key`, https://vueschool.io/lessons/forcing-vue-router-to-destroy-component-to-trigger-lifecycle-hooks -->
    <router-view v-show="showPage" @ready="onPageReady" :key="$route.fullPath" />
    <AppSpinner v-show="!showPage" />
    <AppNotifications />
  </div>
</template>

<script>
import TheNavbar from "@/components/TheNavbar";
import { mapActions } from "vuex";
import AppSpinner from "@/components/AppSpinner";
import NProgress from "nprogress";
import AppNotifications from "@/components/AppNotifications";

export default {
  components: { AppSpinner, TheNavbar, AppNotifications },

  data() {
    return {
      showPage: false,
    };
  },

  methods: {
    ...mapActions("auth", ["fetchAuthUser"]),
    onPageReady() {
      this.showPage = true;
      NProgress.done();
    },
  },

  created() {
    // this.fetchAuthUser();
    NProgress.configure({
      speed: 200,
      showSpinner: false,
    });

    this.$router.beforeEach(() => {
      this.showPage = false;
      NProgress.start();
    });
  },
};
</script>

<style>
@import "assets/style.css";
@import "~nprogress/nprogress.css";

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

#nprogress .bar {
  background: #57ad8d !important;
}
</style>
