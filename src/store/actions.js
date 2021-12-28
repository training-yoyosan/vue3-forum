import { docToResource, findById } from "@/helpers";
import firebase from "firebase";

export default {
  async createPost({ commit, state }, post) {
    post.userId = state.authId;
    post.publishedAt = firebase.firestore.FieldValue.serverTimestamp();

    const batch = firebase.firestore().batch();
    const postRef = firebase.firestore().collection("posts").doc();
    const threadRef = firebase.firestore().collection("threads").doc(post.threadId);
    const userRef = firebase.firestore().collection("users").doc(state.authId);
    batch.set(postRef, post);
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId),
    });
    batch.update(userRef, {
      postsCount: firebase.firestore.FieldValue.increment(1),
    });
    await batch.commit();

    const newPost = await postRef.get();
    commit("setPost", { post: { ...newPost.data(), id: newPost.id } });
    commit("appendPostToThread", {
      childId: newPost.id,
      parentId: post.threadId,
    });
    commit("appendContributorToThread", {
      childId: state.authId,
      parentId: post.threadId,
    });
  },
  async updatePost({ commit, state }, { text, id }) {
    const post = {
      text,
      edited: {
        at: firebase.firestore.FieldValue.serverTimestamp(),
        by: state.authId,
        modified: false,
      },
    };

    const postRef = firebase.firestore().collection("posts").doc(id);
    await postRef.update(post);
    const updatedPost = await postRef.get();
    commit("setItem", { resource: "posts", item: updatedPost });
  },
  async createThread({ commit, state, dispatch }, { text, title, forumId }) {
    const userId = state.authId;
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
    commit("appendThreadToUser", { parentId: userId, childId: threadRef.id });
    commit("appendThreadToForum", { parentId: forumId, childId: threadRef.id });
    await dispatch("createPost", { text, threadId: threadRef.id });

    return findById(state.threads, threadRef.id);
  },
  async updateThread({ commit, state }, { text, title, threadId }) {
    const thread = findById(state.threads, threadId);
    const post = findById(state.posts, thread.posts[0]);
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
    commit("setPost", { post: newPost });

    return docToResource(newThread);
  },
  async registerUserWithEmailAndPassword({ dispatch }, { email, name, username, avatar = null, password }) {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await dispatch("createUser", { id: result.user.uid, email, name, username, avatar });
  },
  async createUser({ commit }, { id, email, name, username, avatar = null }) {
    const registeredAt = firebase.firestore.FieldValue.serverTimestamp();
    const usernameLower = username.toLowerCase();
    email = email.toLowerCase();

    const user = { email, name, username, usernameLower, avatar, registeredAt };
    const userRef = firebase.firestore().collection("users").doc(id);
    await userRef.set(user);

    const newUser = await userRef.get();
    commit("setItem", { resource: "users", item: newUser });

    return docToResource(newUser);
  },
  updateUser({ commit }, user) {
    commit("setUser", { user });
  },
  // ---------------------------------------
  // Fetch Single Resource
  // ---------------------------------------
  fetchCategory: ({ dispatch }, { id }) => dispatch("fetchItem", { emoji: "🏷", resource: "categories", id }),
  fetchForum: ({ dispatch }, { id }) => dispatch("fetchItem", { resource: "forums", id, emoji: "🏁" }),
  fetchThread: ({ dispatch }, { id }) => dispatch("fetchItem", { resource: "threads", id, emoji: "📄" }),
  fetchPost: ({ dispatch }, { id }) => dispatch("fetchItem", { resource: "posts", id, emoji: "💬" }),
  fetchUser: ({ dispatch }, { id }) => dispatch("fetchItem", { resource: "users", id, emoji: "🙋" }),
  fetchAuthUser: ({ dispatch, commit }) => {
    const userId = firebase.auth().currentUser?.uid;

    if (!userId) return;

    dispatch("fetchUser", { id: userId });
    commit("setAuthId", userId);
  },
  fetchItem({ commit }, { resource, id, emoji }) {
    console.log("🔥", emoji, id);
    return new Promise((resolve) => {
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          const item = { ...doc.data(), id: doc.id };
          commit("setItem", { resource, item });
          resolve(item);
        });
      commit("appendUnsubscribe", { unsubscribe });
    });
  },
  async unsubscribeAllSnapshots({ state, commit }) {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe());
    commit("clearAllUnsubscribes");
  },
  // ---------------------------------------
  // Fetch All of a Resource
  // ---------------------------------------
  fetchAllCategories({ commit }) {
    console.log("🔥", "🏷", "all");
    return new Promise((resolve) => {
      const unsubscribe = firebase
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
      commit("appendUnsubscribe", { unsubscribe });
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
  fetchForums: ({ dispatch }, { ids }) => dispatch("fetchItems", { resource: "forums", ids, emoji: "🏁" }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch("fetchItems", { resource: "threads", ids, emoji: "📄" }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch("fetchItems", { resource: "posts", ids, emoji: "💬" }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch("fetchItems", { resource: "users", ids, emoji: "🙋" }),
  fetchItems({ dispatch }, { ids, resource, emoji }) {
    // resolves all promises before returning the array
    return Promise.all(ids.map((id) => dispatch("fetchItem", { id, resource, emoji })));
  },
};
