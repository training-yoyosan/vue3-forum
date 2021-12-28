import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import firebaseConfig from "@/config/firebase";
import FontAwesome from "@/plugins/FontAwesome";

firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged((user) => {
  console.log("auth state changed", user);
  store.dispatch("unsubscribeAuthUserSnapshot");

  if (user) {
    store.dispatch("fetchAuthUser");
  }
});

const app = createApp(App);
app.use(store);
app.use(router);
app.use(FontAwesome);
app.mount("#app");

const requireComponent = require.context("./components", true, /App[A-Z]\w+\.(vue|js)$/);
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName);
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig;
  const baseComponentName = baseComponentConfig.name || fileName.replace(/^.+\//, "").replace(/\.\w+$/, "");
  app.component(baseComponentName, baseComponentConfig);
});
