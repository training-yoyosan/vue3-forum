<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <post-list :posts="threadPosts" />
  </div>
</template>

<script>
import sourceData from "@/data.json";
import PostList from "@/components/PostList";

export default {
  name: "ThreadShow",

  components: {
    PostList,
  },

  props: {
    id: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
    };
  },

  computed: {
    thread() {
      return this.threads.find((t) => t.id === this.id); // available also as this.$route.params.id
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
  },
};
</script>

<style scoped></style>
