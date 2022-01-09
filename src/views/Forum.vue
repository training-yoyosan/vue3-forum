<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div class="col-full push-top">
      <div class="forum-header text-left">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <router-link :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }" class="btn-green btn-small">
          Start a thread
        </router-link>
      </div>
    </div>

    <div class="col-full push-top">
      <ThreadList :threads="forumThreads" />
    </div>
  </div>
</template>

<script>
import ThreadList from "@/components/ThreadList";
import { findById } from "@/helpers";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  name: "Forum",

  components: { ThreadList },

  mixins: [asyncDataStatus],

  props: {
    id: {
      required: true,
      type: String,
    },
  },

  computed: {
    forum() {
      return findById(this.$store.state.forums.items, this.id);
    },
    forumThreads() {
      return this.$store.state.threads.items
        .filter((th) => th.forumId === this.id)
        .map((th) => this.$store.getters["threads/thread"](th.id));
    },
  },

  methods: {
    ...mapActions("forums", ["fetchForum"]),
    ...mapActions("threads", ["fetchThreads"]),
    ...mapActions("users", ["fetchUsers"]),
  },

  async created() {
    const forum = await this.fetchForum({ id: this.id });
    const threads = await this.fetchThreads({
      ids: forum.threads,
    });
    await this.fetchUsers({
      ids: threads.map((t) => t.userId),
    });
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped></style>
