<template>
  <div class="col-full push-top">
    <div class="forum-header text-left">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <a href="new-thread.html" class="btn-green btn-small">Start a thread</a>
    </div>
  </div>

  <div class="col-full push-top">
    <ThreadList :threads="forumThreads" />
  </div>
</template>

<script>
import ThreadList from "@/components/ThreadList";

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
      return this.$store.state.forums.find((fm) => fm.id === this.id);
    },
    forumThreads() {
      return this.$store.state.threads.filter((th) => th.forumId === this.id);
    },
  },
};
</script>

<style scoped></style>
