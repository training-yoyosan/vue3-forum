<template>
  <div class="flex-grid" v-if="user">
    <div class="col-3 push-top">
      <UserProfileCard v-if="!edit" :user="user" />
      <UserProfileCardEditor v-else :user="user" />
    </div>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead"> {{ user.username }}'s recent activity </span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />

      <PostList :posts="user.posts" />
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import { mapGetters } from "vuex";
import UserProfileCard from "@/components/UserProfileCard";
import UserProfileCardEditor from "@/components/UserProfileCardEditor";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  name: "Profile",

  components: { UserProfileCardEditor, UserProfileCard, PostList },

  mixins: [asyncDataStatus],

  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters("auth", { user: "authUser" }),
  },
  async created() {
    await this.$store.dispatch("auth/fetchAuthUsersPosts");
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped></style>
