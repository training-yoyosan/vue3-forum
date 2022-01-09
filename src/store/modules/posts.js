import firebase from "firebase";
import { docToResource, upsert } from "@/helpers";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
    async createPost({ commit, rootState }, post) {
      post.userId = rootState.auth.authId;
      post.publishedAt = firebase.firestore.FieldValue.serverTimestamp();

      const batch = firebase.firestore().batch();
      const postRef = firebase.firestore().collection("posts").doc();
      const threadRef = firebase.firestore().collection("threads").doc(post.threadId);
      const userRef = firebase.firestore().collection("users").doc(rootState.auth.authId);
      batch.set(postRef, post);
      batch.update(threadRef, {
        posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
        contributors: firebase.firestore.FieldValue.arrayUnion(rootState.auth.authId),
      });
      batch.update(userRef, {
        postsCount: firebase.firestore.FieldValue.increment(1),
      });
      await batch.commit();

      const newPost = await postRef.get();
      commit("setPost", { post: { ...newPost.data(), id: newPost.id } });
      commit(
        "threads/appendPostToThread",
        {
          childId: newPost.id,
          parentId: post.threadId,
        },
        { root: true }
      );
      commit(
        "threads/appendContributorToThread",
        {
          childId: rootState.auth.authId,
          parentId: post.threadId,
        },
        { root: true }
      );
    },
    async updatePost({ commit, rootState }, { text, id }) {
      const post = {
        text,
        edited: {
          at: firebase.firestore.FieldValue.serverTimestamp(),
          by: rootState.auth.authId,
          modified: false,
        },
      };

      const postRef = firebase.firestore().collection("posts").doc(id);
      await postRef.update(post);
      const updatedPost = await postRef.get();
      commit("setItem", { resource: "posts", item: updatedPost }, { root: true });
    },
    fetchPost: ({ dispatch }, { id }) => dispatch("fetchItem", { resource: "posts", id, emoji: "💬" }, { root: true }),
    fetchPosts: ({ dispatch }, { ids }) =>
      dispatch("fetchItems", { resource: "posts", ids, emoji: "💬" }, { root: true }),
  },
  mutations: {
    setPost(state, { post }) {
      upsert(state.items, docToResource(post));
    },
  },
};
