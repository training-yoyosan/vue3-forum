import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import firebaseConfig from "@/config/firebase";
import FontAwesome from "@/plugins/FontAwesome";
import vClickOutside from "click-outside-vue3";

firebase.initializeApp(firebaseConfig);

const app = createApp(App);
app.use(store);
app.use(router);
app.use(FontAwesome);
app.use(vClickOutside);
app.mount("#app");

const requireComponent = require.context("./components", true, /App[A-Z]\w+\.(vue|js)$/);
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName);
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig;
  const baseComponentName = baseComponentConfig.name || fileName.replace(/^.+\//, "").replace(/\.\w+$/, "");
  app.component(baseComponentName, baseComponentConfig);
});
