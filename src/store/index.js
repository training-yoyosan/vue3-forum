import { createStore } from "vuex";
import sourceData from "@/data.json";
import { v4 } from "uuid";

export default createStore({
  state: {
    ...sourceData,
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
  },

  mutations: {
    setPost(state, post) {
      state.posts.push(post);
    },
    setUser(state, { user }) {
      const userIndex = state.users.findIndex((usr) => usr.id === user.id);
      state.users[userIndex] = user;
    },
    appendPostToThread(state, { postId, threadId }) {
      state.threads.find((thr) => thr.id === threadId).posts.push(postId);
    },
  },

  actions: {
    createPost({ commit, state }, post) {
      post.id = v4();
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);

      commit("setPost", post);
      commit("appendPostToThread", {
        postId: post.id,
        threadId: post.threadId,
      });
    },
    updateUser({ commit }, user) {
      commit("setUser", { user });
    },
  },

  getters: {
    authUser: (state) => {
      const user = state.users.find((usr) => usr.id === state.authId);

      if (!user) return null;

      return {
        ...user,
        // can be accessed as a property, authUser.posts
        get posts() {
          return state.posts.filter((post) => post.userId === user.id);
        },
        get postsCount() {
          return this.posts.length;
        },
        get threads() {
          return state.threads.filter((thread) => thread.userId === user.id);
        },
        get threadsCount() {
          return this.threads.length;
        },
      };
    },
  },

  modules: {},
});
