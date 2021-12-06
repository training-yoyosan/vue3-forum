import { createStore } from "vuex";
import sourceData from "@/data.json";
import { v4 } from "uuid";

export default createStore({
  state: {
    ...sourceData,
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
  },

  mutations: {
    setPost(state, { post }) {
      const index = state.posts.findIndex((p) => p.id === post.id);
      if (post && index !== -1) {
        state.posts[index] = post;
      } else {
        state.posts.push(post);
      }
    },
    setUser(state, { user }) {
      const userIndex = state.users.findIndex((usr) => usr.id === user.id);
      state.users[userIndex] = user;
    },
    setThread(state, { thread }) {
      const index = state.threads.findIndex((t) => t.id === thread.id);
      if (thread && index !== -1) {
        state.threads[index] = thread;
      } else {
        state.threads.push(thread);
      }
    },
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((thr) => thr.id === threadId);
      thread.posts = thread.posts || [];
      thread.posts.push(postId);
    },
    appendThreadToForum(state, { forumId, threadId }) {
      const forum = state.forums.find((forum) => forum.id === forumId);
      forum.threads = forum.threads || [];
      forum.threads.push(threadId);
    },
    appendThreadToUser(state, { userId, threadId }) {
      const user = state.forums.find((user) => user.id === userId);
      user.threads = user.threads || [];
      user.threads.push(threadId);
    },
  },

  actions: {
    createPost({ commit, state }, post) {
      post.id = v4();
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);

      commit("setPost", { post });
      commit("appendPostToThread", {
        postId: post.id,
        threadId: post.threadId,
      });
    },
    async createThread({ commit, state, dispatch }, { text, title, forumId }) {
      const id = v4();
      const userId = state.authId;
      const publishedAt = Math.floor(Date.now() / 1000);
      const thread = { forumId, title, publishedAt, userId, id };

      commit("setThread", { thread });
      dispatch("createPost", { text, threadId: id });

      return state.threads.find((thread) => thread.id === id);
    },
    async updateThread({ commit, state }, { text, title, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId);
      const post = state.posts.find((post) => post.id === thread.posts[0]);
      const newThread = { ...thread, title };
      const newPost = { ...post, text };

      commit("setThread", { thread: newThread });
      commit("setPost", { post: newPost });

      return newThread;
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
