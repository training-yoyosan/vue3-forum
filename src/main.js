import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "@/helpers/firebase";
import firebaseConfig from "@/config/firebase";
import FontAwesome from "@/plugins/FontAwesome";
import vClickOutside from "click-outside-vue3";
import PageScrollDirective from "@/plugins/PageScrollDirective";
import Vue3Pagination from "@/plugins/Vue3Pagination";
import VeeValidatePlugin from "@/plugins/VeeValidatePlugin";

firebase.initializeApp(firebaseConfig);

const app = createApp(App);
app.use(store);
app.use(router);
app.use(FontAwesome);
app.use(vClickOutside);
app.use(PageScrollDirective);
app.use(Vue3Pagination);
app.use(VeeValidatePlugin);
app.mount("#app");

const requireComponent = require.context("./components", true, /App[A-Z]\w+\.(vue|js)$/);
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName);
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig;
  const baseComponentName = baseComponentConfig.name || fileName.replace(/^.+\//, "").replace(/\.\w+$/, "");
  app.component(baseComponentName, baseComponentConfig);
});
