import { createStore } from "vuex";
import { v4 } from "uuid";
import { findById, upsert } from "@/helpers";
import firebase from "firebase";

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
  },

  mutations: {
    setItem(state, { resource, item }) {
      upsert(state[resource], item);
    },
    setPost(state, { post }) {
      upsert(state.posts, post);
    },
    setUser(state, { user }) {
      upsert(state.users, user);
    },
    setThread(state, { thread }) {
      upsert(state.threads, thread);
    },
    appendPostToThread: makeAppendChildToParentMutation({
      parent: "threads",
      child: "posts",
    }),
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: "forums",
      child: "threads",
    }),
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: "users",
      child: "threads",
    }),
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: "threads",
      child: "contributors",
    }),
  },

  actions: {
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
    fetchCategory({ dispatch }, { id }) {
      return dispatch("fetchItem", { emoji: "🏷", resource: "categories", id });
    },
    fetchForum({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "forums", id, emoji: "🏁" });
    },
    fetchThread({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "threads", id, emoji: "📄" });
    },
    fetchPost({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "posts", id, emoji: "💬" });
    },
    fetchUser({ dispatch }, { id }) {
      return dispatch("fetchItem", { resource: "users", id, emoji: "🙋" });
    },
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
    fetchCategories({ dispatch }, { ids }) {
      return dispatch("fetchItems", {
        resource: "categories",
        ids,
        emoji: "🏷",
      });
    },
    fetchForums({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "forums", ids, emoji: "🏁" });
    },
    fetchThreads({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "threads", ids, emoji: "📄" });
    },
    fetchPosts({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "posts", ids, emoji: "💬" });
    },
    fetchUsers({ dispatch }, { ids }) {
      return dispatch("fetchItems", { resource: "users", ids, emoji: "🙋" });
    },
    fetchItems({ dispatch }, { ids, resource, emoji }) {
      // resolves all promises before returning the array
      return Promise.all(
        ids.map((id) => dispatch("fetchItem", { id, resource, emoji }))
      );
    },
  },

  getters: {
    authUser: (state, getters) => getters.user(state.authId),
    user: (state) => {
      return (id) => {
        const user = findById(state.users, id);

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
      };
    },
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id);
        return {
          ...thread,
          get author() {
            return findById(state.users, thread.userId);
          },
          get repliesCount() {
            return thread.posts.length - 1;
          },
          get contributorsCount() {
            return thread.contributors?.length;
          },
        };
      };
    },
  },

  modules: {},
});

function makeAppendChildToParentMutation({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId);

    if (!resource) {
      console.error(
        `Appending ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist.`
      );
      return;
    }

    resource[child] = resource[child] || [];

    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
}
