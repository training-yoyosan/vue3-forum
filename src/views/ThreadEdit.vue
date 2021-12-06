<template>
  <div class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor
      :text="text"
      :title="thread.title"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";

export default {
  name: "ThreadEdit",
  components: { ThreadEditor },
  props: {
    id: {
      type: String,
      required: true,
    },
  },

  computed: {
    thread() {
      return this.$store.state.threads.find((t) => t.id === this.id);
    },
    text() {
      return this.$store.state.posts.find(
        (post) => post.id === this.thread.posts[0]
      ).text;
    },
  },

  methods: {
    async save({ title, text }) {
      const thread = await this.$store.dispatch("updateThread", {
        threadId: this.id,
        title,
        text,
      });

      this.$router.push({ name: "ThreadShow", params: { id: thread.id } });
    },
    cancel() {
      this.$router.push({ name: "Forum", params: { id: this.forum.id } });
    },
  },
};
</script>

<style scoped></style>
