<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor :text="text" :title="thread.title" @save="save" @cancel="cancel" />
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";
import { findById } from "@/helpers";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  name: "ThreadEdit",

  components: { ThreadEditor },

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  mixins: [asyncDataStatus],

  computed: {
    thread() {
      return findById(this.$store.state.threads.items, this.id) || {};
    },
    text() {
      if (this.$store.state.posts.items && this.thread.posts !== undefined) {
        const post = findById(this.$store.state.posts.items, this.thread.posts[0]);
        return post ? post.text : "";
      }

      return "";
    },
  },

  methods: {
    ...mapActions("threads", ["updateThread", "fetchThread"]),
    ...mapActions("posts", ["fetchPost"]),

    async save({ title, text }) {
      const thread = await this.updateThread({
        threadId: this.id,
        title,
        text,
      });

      this.$router.push({ name: "ThreadShow", params: { id: thread.id } });
    },
    cancel() {
      this.$router.push({ name: "ThreadShow", params: { id: this.id } });
    },
  },

  async created() {
    const thread = await this.fetchThread({ id: this.id });
    await this.fetchPost({ id: thread.posts[0] });
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped></style>
