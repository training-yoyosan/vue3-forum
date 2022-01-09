import { createStore } from "vuex";
import mutations from "@/store/mutations";
import actions from "@/store/actions";
import getters from "@/store/getters";
import auth from "@/store/modules/auth";
import categories from "@/store/modules/categories";
import forums from "@/store/modules/forums";
import posts from "@/store/modules/posts";
import threads from "@/store/modules/threads";
import users from "@/store/modules/users";

export default createStore({
  state: {
    unsubscribes: [],
  },

  getters,
  actions,
  mutations,

  modules: {
    auth,
    categories,
    forums,
    posts,
    threads,
    users,
  },
});
