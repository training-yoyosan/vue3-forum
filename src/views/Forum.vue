<template>
  <div class="col-full push-top">
    <div class="forum-header text-left">
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
      return this.$store.state.threads.filter((th) => th.forumId === this.id);
    },
  },
};
</script>

<style scoped></style>
