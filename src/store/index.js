import { createStore } from "vuex";
import sourceData from "@/data.json";
import { v4 } from "uuid";

export default createStore({
  state: sourceData,
  mutations: {
    setPost(state, { post }) {
      state.posts.push(post);
    },
    appendPostToThread(state, { postId, threadId }) {
      state.threads.find((thr) => thr.id === threadId).posts.push(postId);
    },
  },
  actions: {
    createPost(context, { post }) {
      post.id = v4();
      context.commit("setPost", { post });
      context.commit("appendPostToThread", {
        postId: post.id,
        threadId: post.threadId,
      });
    },
  },
  modules: {},
});
