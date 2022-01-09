import firebase from "firebase";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) =>
      dispatch("fetchItem", { emoji: "🏷", resource: "categories", id }, { root: true }),
    fetchCategories: ({ dispatch }, { ids }) => {
      dispatch(
        "fetchItems",
        {
          resource: "categories",
          ids,
          emoji: "🏷",
        },
        { root: true }
      );
    },
    fetchAllCategories({ commit }) {
      console.log("🔥", "🏷", "all");
      return new Promise((resolve) => {
        const unsubscribe = firebase
          .firestore()
          .collection("categories")
          .onSnapshot(async (querySnap) => {
            const categories = querySnap.docs.map((doc) => {
              const item = { id: doc.id, ...doc.data() };
              commit("setItem", { resource: "categories", item }, { root: true });
              return item;
            });
            resolve(categories);
          });
        commit("appendUnsubscribe", { unsubscribe }, { root: true });
      });
    },
  },
  mutations: {},
};
