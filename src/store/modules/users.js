import {
  docToResource,
  findById,
  makeAppendChildToParentMutation,
  makeFetchItemAction,
  makeFetchItemsAction,
  upsert,
} from "@/helpers";
import firebase from "@/helpers/firebase";

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    user: (state, getters, rootState) => {
      return (id) => {
        const user = findById(state.items, id);

        if (!user) return null;

        return {
          ...user,
          // can be accessed as a property, authUser.posts
          get posts() {
            return rootState.posts.items.filter((post) => post.userId === user.id);
          },
          get postsCount() {
            return user.postsCount || 0;
          },
          get threads() {
            return rootState.threads.items.filter((thread) => thread.userId === user.id);
          },
          get threadsCount() {
            return user.threads?.length || 0;
          },
        };
      };
    },
  },
  actions: {
    async createUser({ commit }, { id, email, name, username, avatar = null }) {
      const registeredAt = firebase.firestore.FieldValue.serverTimestamp();
      const usernameLower = username.toLowerCase();
      email = email.toLowerCase();

      const user = { email, name, username, usernameLower, avatar, registeredAt };
      const userRef = firebase.firestore().collection("users").doc(id);
      await userRef.set(user);

      const newUser = await userRef.get();
      commit("setItem", { resource: "users", item: newUser }, { root: true });

      return docToResource(newUser);
    },
    async updateUser({ commit }, user) {
      const updates = {
        avatar: user.avatar || null,
        username: user.username || null,
        name: user.name || null,
        bio: user.bio || null,
        website: user.website || null,
        email: user.email || null,
        location: user.location || null,
      };

      const userRef = firebase.firestore().collection("users").doc(user.id);
      await userRef.update(updates);

      commit("setUser", { user });
    },
    fetchUser: makeFetchItemAction({ emoji: "🙋", resource: "users" }),
    fetchUsers: makeFetchItemsAction({ resource: "users", emoji: "🙋" }),
  },
  mutations: {
    setUser(state, { user }) {
      upsert(state.items, docToResource(user));
    },
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: "users",
      child: "threads",
    }),
  },
};
