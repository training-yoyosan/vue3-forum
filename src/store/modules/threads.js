import {
  docToResource,
  findById,
  makeAppendChildToParentMutation,
  makeFetchItemAction,
  makeFetchItemsAction,
  upsert,
} from "@/helpers";
import firebase from "@/helpers/firebase";
import { chunk } from "lodash/array";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    thread: (state, getters, rootState) => {
      return (id) => {
        const thread = findById(state.items, id);

        if (!thread) return {};

        return {
          ...thread,
          get author() {
            return findById(rootState.users.items, thread.userId);
          },
          get repliesCount() {
            return thread.posts?.length - 1 || 0;
          },
          get contributorsCount() {
            return thread.contributors?.length;
          },
        };
      };
    },
  },
  actions: {
    async createThread({ commit, state, dispatch, rootState }, { text, title, forumId }) {
      const userId = rootState.auth.authId;
      const publishedAt = firebase.firestore.FieldValue.serverTimestamp();

      const batch = firebase.firestore().batch();
      const threadRef = firebase.firestore().collection("threads").doc();
      const thread = { forumId, title, publishedAt, userId, id: threadRef.id };
      const userRef = firebase.firestore().collection("users").doc(userId);
      const forumRef = firebase.firestore().collection("forums").doc(forumId);

      batch.set(threadRef, thread);
      batch.update(userRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
      });
      batch.update(forumRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
      });
      await batch.commit();

      const newThread = await threadRef.get();

      commit("setThread", { thread: { ...newThread.data(), id: newThread.id } });
      commit("users/appendThreadToUser", { parentId: userId, childId: threadRef.id }, { root: true });
      commit("forums/appendThreadToForum", { parentId: forumId, childId: threadRef.id }, { root: true });
      await dispatch("posts/createPost", { text, threadId: threadRef.id }, { root: true });

      return findById(state.items, threadRef.id);
    },
    async updateThread({ commit, state, rootState }, { text, title, threadId }) {
      const thread = findById(state.items, threadId);
      const post = findById(rootState.posts.items, thread.posts[0]);
      let newThread = { ...thread, title };
      let newPost = { ...post, text };

      const threadRef = firebase.firestore().collection("threads").doc(threadId);
      const postRef = firebase.firestore().collection("posts").doc(post.id);
      const batch = firebase.firestore().batch();
      batch.update(threadRef, newThread);
      batch.update(postRef, newPost);
      await batch.commit();

      newThread = await firebase.firestore().collection("threads").doc(threadId);
      newPost = await firebase.firestore().collection("posts").doc(post.id);

      commit("setThread", { thread: newThread });
      commit("posts/setPost", { post: newPost }, { root: true });

      return docToResource(newThread);
    },
    fetchThread: makeFetchItemAction({ resource: "threads", emoji: "📄" }),
    fetchThreads: makeFetchItemsAction({ resource: "threads", emoji: "📄" }),
    fetchThreadsByPage: ({ dispatch, commit }, { ids, page, perPage = 10 }) => {
      commit("clearThreads");
      const chunks = chunk(ids, perPage);
      const limitedIds = chunks[page - 1];
      return dispatch("fetchThreads", { ids: limitedIds });
    },
  },
  mutations: {
    setThread(state, { thread }) {
      upsert(state.items, docToResource(thread));
    },
    appendPostToThread: makeAppendChildToParentMutation({
      parent: "threads",
      child: "posts",
    }),
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: "threads",
      child: "contributors",
    }),
    clearThreads(state) {
      state.items = [];
    },
  },
};
