<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', params: { id: this.id } }"
        class="btn-green btn-small"
        tag="button"
      >
        Edit
      </router-link>
    </h1>

    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >,
      <AppDate :timestamp="thread.publishedAt" />
      .
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }} replies by
        {{ thread.contributorsCount }} contributors</span
      >
    </p>

    <post-list :posts="threadPosts" />

    <post-editor @save="addPost" />
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";

export default {
  name: "ThreadShow",

  components: {
    PostList,
    PostEditor,
  },

  props: {
    id: {
      required: true,
      type: String,
    },
  },

  computed: {
    threads() {
      return this.$store.state.threads;
    },
    posts() {
      return this.$store.state.posts;
    },
    thread() {
      return this.$store.getters.thread(this.id); // available also as this.$route.params.id
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
  },

  methods: {
    addPost(eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id,
      };
      this.$store.dispatch("createPost", post);
    },
  },

  async created() {
    const thread = await this.$store.dispatch("fetchThread", { id: this.id });
    this.$store.dispatch("fetchUser", { id: thread.userId });

    thread.posts.forEach(async (postId) => {
      const post = await this.$store.dispatch("fetchPost", { id: postId });
      this.$store.dispatch("fetchUser", { id: post.userId });
    });
  },
};
</script>

<style scoped></style>
