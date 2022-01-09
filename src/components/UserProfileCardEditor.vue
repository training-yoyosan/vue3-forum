<template>
  <div class="profile-card">
    <form @submit.prevent="save">
      <p class="text-center">
        <img :src="user.avatar" :alt="`${user.name} profile picture`" class="avatar-xlarge img-update" />
      </p>

      <div class="form-group">
        <input
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
          v-model="activeUser.username"
        />
      </div>

      <div class="form-group">
        <input type="text" placeholder="Full Name" class="form-input text-lead" v-model="activeUser.name" />
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          class="form-input"
          id="user_bio"
          placeholder="Write a few words about yourself."
          v-model="activeUser.bio"
        ></textarea>
      </div>

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input autocomplete="off" class="form-input" id="user_website" v-model="activeUser.website" />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input autocomplete="off" class="form-input" id="user_email" v-model="activeUser.email" />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input autocomplete="off" class="form-input" id="user_location" v-model="activeUser.location" />
      </div>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel" type="reset">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "UserProfileCardEditor",

  data() {
    return { activeUser: { ...this.user } };
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  methods: {
    save() {
      this.$store.dispatch("users/updateUser", { ...this.activeUser });
      this.$router.push({ name: "Profile" });
    },
    cancel() {
      this.$router.push({ name: "Profile" });
    },
  },
};
</script>

<style scoped></style>
