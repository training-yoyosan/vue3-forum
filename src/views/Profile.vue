<template>
  <div class="flex-grid">
    <div class="col-3 push-top">
      <UserProfileCard v-if="!edit" :user="user" />
      <UserProfileCardEditor v-else :user="user" />
    </div>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead"> Joker's recent activity </span>
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

export default {
  name: "Profile",

  components: { UserProfileCardEditor, UserProfileCard, PostList },

  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({ user: "authUser" }),
  },
};
</script>

<style scoped></style>
