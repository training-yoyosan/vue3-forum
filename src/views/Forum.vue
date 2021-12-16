<template>
  <div class="col-full push-top">
    <div v-if="forum" class="forum-header text-left">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
        :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
        class="btn-green btn-small"
      >
        Start a thread
      </router-link>
    </div>
  </div>

  <div class="col-full push-top">
    <ThreadList :threads="forumThreads" />
  </div>
</template>

<script>
import ThreadList from "@/components/ThreadList";
import { findById } from "@/helpers";

export default {
  name: "Forum",
  components: { ThreadList },
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    forum() {
      return findById(this.$store.state.forums, this.id);
    },
    forumThreads() {
      return this.$store.state.threads.map((th) =>
        this.$store.getters.thread(th.id)
      );
    },
  },

  async created() {
    const forum = await this.$store.dispatch("fetchForum", { id: this.id });
    const threads = await this.$store.dispatch("fetchThreads", {
      ids: forum.threads,
    });
    this.$store.dispatch("fetchUsers", {
      ids: threads.map((t) => t.userId),
    });
  },
};
</script>

<style scoped></style>
