<template>
  <div class="flex-grid" v-if="user">
    <div class="col-3 push-top">
      <UserProfileCard v-if="!edit" :user="user" />
      <UserProfileCardEditor v-else :user="user" />
    </div>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead"> {{ user.username }}'s recent activity </span>
      </div>

      <hr />

      <PostList :posts="user.posts" />
      <AppInfiniteScroll @load="fetchUserPosts" :done="user.posts.length === user.postsCount" />
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import { mapGetters } from "vuex";
import UserProfileCard from "@/components/UserProfileCard";
import UserProfileCardEditor from "@/components/UserProfileCardEditor";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import AppInfiniteScroll from "@/components/AppInfiniteScroll";

export default {
  name: "Profile",

  components: { AppInfiniteScroll, UserProfileCardEditor, UserProfileCard, PostList },

  mixins: [asyncDataStatus],

  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters("auth", { user: "authUser" }),
    lastPostFetched() {
      if (this.user.posts.length === 0) {
        return null;
      }

      return this.user.posts[this.user.posts.length - 1];
    },
  },

  methods: {
    fetchUserPosts() {
      return this.$store.dispatch("auth/fetchAuthUsersPosts", { startAfter: this.lastPostFetched });
    },
  },

  async created() {
    await this.fetchUserPosts();
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped></style>
