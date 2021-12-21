import { v4 } from "uuid";
import { findById } from "@/helpers";
import firebase from "firebase";

export default {
  createPost({ commit, state }, post) {
    post.id = v4();
    post.userId = state.authId;
    post.publishedAt = Math.floor(Date.now() / 1000);

    commit("setPost", { post });
    commit("appendPostToThread", {
      childId: post.id,
      parentId: post.threadId,
    });
    commit("appendContributorToThread", {
      childId: state.authId,
      parentId: post.threadId,
    });
  },
  async createThread({ commit, state, dispatch }, { text, title, forumId }) {
    const id = v4();
    const userId = state.authId;
    const publishedAt = Math.floor(Date.now() / 1000);
    const thread = { forumId, title, publishedAt, userId, id };

    commit("setThread", { thread });
    commit("appendThreadToUser", { parentId: userId, childId: id });
    commit("appendThreadToForum", { parentId: forumId, childId: id });
    dispatch("createPost", { text, threadId: id });

    return findById(state.threads, id);
  },
  async updateThread({ commit, state }, { text, title, threadId }) {
    const thread = findById(state.threads, threadId);
    const post = findById(state.posts, thread.posts[0]);
    const newThread = { ...thread, title };
    const newPost = { ...post, text };

    commit("setThread", { thread: newThread });
    commit("setPost", { post: newPost });

    return newThread;
  },
  updateUser({ commit }, user) {
    commit("setUser", { user });
  },
  // ---------------------------------------
  // Fetch Single Resource
  // ---------------------------------------
  fetchCategory: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { emoji: "🏷", resource: "categories", id }),
  fetchForum: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "forums", id, emoji: "🏁" }),
  fetchThread: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "threads", id, emoji: "📄" }),
  fetchPost: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "posts", id, emoji: "💬" }),
  fetchUser: ({ dispatch }, { id }) =>
    dispatch("fetchItem", { resource: "users", id, emoji: "🙋" }),
  fetchAuthUser: ({ dispatch, state }) =>
    dispatch("fetchUser", { id: state.authId }),
  fetchItem({ commit }, { resource, id, emoji }) {
    console.log("🔥", emoji, id);
    return new Promise((resolve) => {
      firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          const item = { ...doc.data(), id: doc.id };
          commit("setItem", { resource, item });
          resolve(item);
        });
    });
  },
  // ---------------------------------------
  // Fetch All of a Resource
  // ---------------------------------------
  fetchAllCategories({ commit }) {
    console.log("🔥", "🏷", "all");
    return new Promise((resolve) => {
      firebase
        .firestore()
        .collection("categories")
        .onSnapshot(async (querySnap) => {
          const categories = querySnap.docs.map((doc) => {
            const item = { id: doc.id, ...doc.data() };
            commit("setItem", { resource: "categories", item });
            return item;
          });
          resolve(categories);
        });
    });
  },
  // ---------------------------------------
  // Fetch Multiple Resources
  // ---------------------------------------
  fetchCategories: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", {
      resource: "categories",
      ids,
      emoji: "🏷",
    }),
  fetchForums: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "forums", ids, emoji: "🏁" }),
  fetchThreads: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "threads", ids, emoji: "📄" }),
  fetchPosts: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "posts", ids, emoji: "💬" }),
  fetchUsers: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", { resource: "users", ids, emoji: "🙋" }),
  fetchItems({ dispatch }, { ids, resource, emoji }) {
    // resolves all promises before returning the array
    return Promise.all(
      ids.map((id) => dispatch("fetchItem", { id, resource, emoji }))
    );
  },
};
