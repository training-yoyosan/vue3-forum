<template>
  <div class="col-full push-top">
    <form @submit.prevent="addPost">
      <div class="form-group">
        <textarea
          id="thread_content"
          class="form-input"
          name="content"
          rows="8"
          cols="140"
          v-model="postCopy.text"
        ></textarea>
      </div>

      <div class="btn-group">
        <button class="btn btn-blue" type="submit" name="submit">
          {{ post.id ? "Update Post" : "Submit Post" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "PostEditor",

  props: {
    post: {
      type: Object,
      default: () => ({ text: null }),
    },
  },

  data() {
    return {
      postCopy: { ...this.post },
    };
  },

  methods: {
    addPost() {
      this.$emit("save", { post: this.postCopy });
      this.postCopy.text = "";
    },
  },
};
</script>

<style scoped></style>
