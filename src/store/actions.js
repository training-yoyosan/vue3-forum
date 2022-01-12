import firebase from "firebase";
import { findById } from "@/helpers";

export default {
  fetchItem({ state, commit }, { resource, id, emoji, handleUnsubscribe = null, once = false, onSnapshot = null }) {
    console.log("🔥", emoji, id);
    return new Promise((resolve) => {
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          if (once) {
            unsubscribe();
          }

          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id };
            let previousItem = findById(state[resource].items, id);
            previousItem = previousItem ? { ...previousItem } : null;

            commit("setItem", { resource, item });

            if (typeof onSnapshot === "function") {
              const isLocal = doc.metadata.hasPendingWrites;
              onSnapshot({ item: { ...item }, previousItem, isLocal });
            }

            resolve(item);
          } else {
            resolve(null);
          }
        });

      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe);
      } else {
        commit("appendUnsubscribe", { unsubscribe });
      }
    });
  },
  async unsubscribeAllSnapshots({ state, commit }) {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe());
    commit("clearAllUnsubscribes");
  },
  fetchItems({ dispatch }, { ids, resource, emoji, onSnapshot = null }) {
    if (!ids) {
      return;
    }

    // resolves all promises before returning the array
    return Promise.all(ids.map((id) => dispatch("fetchItem", { id, resource, emoji, onSnapshot })));
  },
};
