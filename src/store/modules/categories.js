import firebase from "@/helpers/firebase";
import { makeFetchItemAction, makeFetchItemsAction } from "@/helpers";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
    fetchCategory: makeFetchItemAction({ emoji: "🏷", resource: "categories" }),
    fetchCategories: makeFetchItemsAction({ emoji: "🏷", resource: "categories" }),
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
