<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div v-if="threads.length">
        <div class="thread" v-for="thread in threads" :key="thread.id">
          <div>
            <p>
              <router-link :to="{ name: 'ThreadShow', params: { id: thread.id } }">{{ thread.title }} </router-link>
            </p>
            <p class="text-faded text-xsmall text-left">
              By <a href="#">{{ userById(thread.userId).name }}</a
              >&nbsp;
              <app-date :timestamp="thread.publishedAt" />
            </p>
          </div>

          <div class="activity">
            <p class="replies-count">{{ thread.repliesCount }} repl{{ thread.repliesCount > 1 ? "ies" : "y" }}</p>

            <AppAvatarImg class="avatar-medium" :src="userById(thread.userId).avatar" alt="" />

            <div>
              <p class="text-xsmall">
                <a href="#">{{ userById(thread.userId).name }}</a>
              </p>
              <p class="text-xsmall text-faded">
                <app-date :timestamp="thread.publishedAt" />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!threads.length" style="padding: 10px; text-align: center">
        <em>No Threads Available</em>
      </div>
    </div>
  </div>
</template>

<script>
import AppAvatarImg from "@/components/AppAvatarImg";
export default {
  name: "ThreadList",
  components: { AppAvatarImg },
  props: {
    threads: {
      type: Array,
      required: true,
    },
  },

  computed: {
    posts() {
      return this.$store.state.posts.items;
    },
    users() {
      return this.$store.state.users.items;
    },
  },

  methods: {
    userById(userId) {
      return this.$store.getters["users/user"](userId) || {};
    },
  },
};
</script>

<style scoped></style>
