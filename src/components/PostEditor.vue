<template>
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
          v-model="text"
        ></textarea>
      </div>

      <div class="btn-group">
        <button class="btn btn-blue" type="submit" name="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import { v4 } from "uuid";

export default {
  name: "PostEditor",

  data() {
    return {
      text: "",
    };
  },

  methods: {
    addPost() {
      const id = v4();

      const post = {
        id,
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        userId: "Miej9zSGMRZKDvMXzfxjVOyv3RF3",
      };

      this.$emit("save", { post });

      this.text = "";
    },
  },
};
</script>

<style scoped></style>
