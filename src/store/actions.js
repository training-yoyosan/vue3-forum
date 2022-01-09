import firebase from "firebase";

export default {
  fetchItem({ commit }, { resource, id, emoji, handleUnsubscribe = null }) {
    console.log("🔥", emoji, id);
    return new Promise((resolve) => {
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          console.log("on snapshot", resource, doc.data());
          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id };
            commit("setItem", { resource, item });
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
  fetchItems({ dispatch }, { ids, resource, emoji }) {
    if (!ids) {
      return;
    }

    // resolves all promises before returning the array
    return Promise.all(ids.map((id) => dispatch("fetchItem", { id, resource, emoji })));
  },
};
