<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input
        v-model="thread.title"
        type="text"
        id="thread_title"
        class="form-input"
        name="title"
      />
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="thread.text"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>

    <div class="btn-group">
      <button class="btn btn-ghost" type="reset" @click="$emit('cancel')">
        Cancel
      </button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ existing ? "Update" : "Publish" }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: "ThreadEditor",

  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
  },

  computed: {
    existing() {
      return !!this.title;
    },
  },

  data() {
    return {
      thread: {
        title: this.title,
        text: this.text,
      },
    };
  },

  methods: {
    save() {
      this.$emit("save", { ...this.thread });
    },
  },
};
</script>

<style scoped></style>
