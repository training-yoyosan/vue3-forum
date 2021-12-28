import { createStore } from "vuex";
import mutations from "@/store/mutations";
import actions from "@/store/actions";
import getters from "@/store/getters";

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: null,
    unsubscribes: [],
  },

  getters,
  actions,
  mutations,

  modules: {},
});
