<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>

    <post-list :posts="threadPosts" />

    <div class="col-full push-top">
      <form @submit.prevent="addPost">
        <div class="form-group">
          <label for="thread_content">Content:</label>
          <textarea
            id="thread_content"
            class="form-input"
            name="content"
            rows="8"
            cols="140"
            v-model="newPostText"
          ></textarea>
        </div>

        <div class="btn-group">
          <button class="btn btn-ghost">Cancel</button>
          <button class="btn btn-blue" type="submit" name="Publish">
            Publish
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import sourceData from "@/data.json";
import PostList from "@/components/PostList";
import { v4 } from "uuid";

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
      newPostText: "",
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

  methods: {
    addPost() {
      const id = v4();

      const post = {
        id,
        text: this.newPostText,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.id,
        userId: "Miej9zSGMRZKDvMXzfxjVOyv3RF3",
      };

      this.posts.push(post);
      this.thread.posts.push(id);

      this.newPostText = "";
    },
  },
};
</script>

<style scoped></style>
