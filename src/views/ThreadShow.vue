<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        v-if="thread.userId === authUser?.id"
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
      <span style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }} replies by {{ thread.contributorsCount }} contributors</span
      >
    </p>

    <post-list :posts="threadPosts" />

    <post-editor v-if="authUser" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to="{ name: 'SignIn', query: { redirectTo: $route.path } }">Sign In</router-link> or
      <router-link :to="{ name: 'Register', query: { redirectTo: $route.path } }">Register</router-link> to reply.
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";
import AppDate from "@/components/AppDate";
import { mapActions, mapGetters } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  name: "ThreadShow",

  components: {
    PostList,
    PostEditor,
    AppDate,
  },

  props: {
    id: {
      required: true,
      type: String,
    },
  },

  mixins: [asyncDataStatus],

  computed: {
    ...mapGetters("auth", ["authUser"]),
    threads() {
      return this.$store.state.threads.items.length > 0 ? this.$store.state.threads.items : [];
    },
    posts() {
      return this.$store.state.posts.items.length > 0 ? this.$store.state.posts.items : [];
    },
    thread() {
      return this.$store.getters["threads/thread"](this.id); // available also as this.$route.params.id
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
  },

  methods: {
    ...mapActions("threads", ["fetchThread"]),
    ...mapActions("posts", ["fetchPosts"]),
    ...mapActions("users", ["fetchUsers"]),
    addPost(eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id,
      };
      this.$store.dispatch("posts/createPost", post);
    },
  },

  async created() {
    const thread = await this.fetchThread({ id: this.id });

    const posts = await this.fetchPosts({
      ids: thread.posts,
    });
    await this.fetchUsers({
      ids: posts.map((post) => post.userId).concat(thread.userId),
    });
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped></style>
