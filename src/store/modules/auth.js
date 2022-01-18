import firebase from "@/helpers/firebase";
import useNotifications from "@/composables/useNotifications";

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null,
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => rootGetters["users/user"](state.authId),
  },
  actions: {
    initAuthentication({ dispatch, commit, state }) {
      if (state.authObserverUnsubscribe) {
        return;
      }

      return new Promise((resolve) => {
        // ensure there is one subscriber per authenticated user
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          dispatch("unsubscribeAuthUserSnapshot");

          if (user) {
            await dispatch("fetchAuthUser");
            resolve(user);
          } else {
            resolve(null);
          }
        });
        commit("setAuthObserverUnsubscribe", unsubscribe);
      });
    },
    async registerUserWithEmailAndPassword({ dispatch }, { email, name, username, avatar = null, password }) {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
      avatar = await dispatch("uploadAvatar", { authId: result.user.uid, file: avatar });
      await dispatch("users/createUser", { id: result.user.uid, email, name, username, avatar }, { root: true });
    },
    async uploadAvatar({ state }, { authId, file }) {
      if (!file) return null;

      authId = authId || state.authId;

      try {
        const storageBucket = firebase.storage().ref().child(`uploads/${authId}/images/${Date.now()}-${file.name}`);
        const snapshot = await storageBucket.put(file);

        return await snapshot.ref.getDownloadURL();
      } catch (e) {
        const { addNotification } = useNotifications();
        addNotification({ message: "Error uploading avatar image!", type: "error" });
      }
    },
    signInWithEmailAndPassword(context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    },
    async signInWithGoogle({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider();
      const response = await firebase.auth().signInWithPopup(provider);
      const user = response.user;
      const userRef = firebase.firestore().collection("users").doc(user.uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return dispatch(
          "users/createUser",
          {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            username: user.email,
            avatar: user.photoURL,
          },
          { root: true }
        );
      }
    },
    async signOut({ commit }) {
      await firebase.auth().signOut();
      commit("setAuthId", null);
    },
    fetchAuthUser: async ({ dispatch, commit }) => {
      const userId = firebase.auth().currentUser?.uid;

      if (!userId) return;

      await dispatch(
        "fetchItem",
        {
          resource: "users",
          id: userId,
          emoji: "🙋",
          handleUnsubscribe: (unsubscribe) => {
            commit("setAuthUserUnsubscribe", unsubscribe);
          },
        },
        { root: true }
      );
      commit("setAuthId", userId);
    },
    async fetchAuthUsersPosts({ state, commit }, { startAfter }) {
      let query = firebase
        .firestore()
        .collection("posts")
        .where("userId", "==", state.authId)
        .orderBy("publishedAt", "desc")
        .limit(5);

      if (startAfter) {
        const doc = await firebase.firestore().collection("posts").doc(startAfter.id).get();
        query = query.startAfter(doc);
      }

      const posts = await query.get();

      posts.forEach((item) => commit("setItem", { resource: "posts", item }, { root: true }));
    },
    unsubscribeAuthUserSnapshot({ state, commit }) {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe();
        commit("setAuthUserUnsubscribe", null);
      }
    },
  },
  mutations: {
    setAuthId(state, id) {
      state.authId = id;
    },
    setAuthUserUnsubscribe(state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe;
    },
    setAuthObserverUnsubscribe(state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe;
    },
  },
};
