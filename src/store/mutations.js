import { findById, upsert } from "@/helpers";

export default {
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
};

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