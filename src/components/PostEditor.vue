<template>
  <div class="col-full push-top">
    <VeeForm @submit="addPost" :key="formKey">
      <AppFormField as="textarea" name="text" v-model="postCopy.text" rows="8" cols="140" rules="required" />

      <div class="btn-group">
        <button class="btn btn-blue" type="submit" name="submit">
          {{ post.id ? "Update Post" : "Submit Post" }}
        </button>
      </div>
    </VeeForm>
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
      // make sure the form id is unique so that it's not validated after saving
      formKey: Math.random(),
    };
  },

  methods: {
    addPost() {
      this.$emit("save", { post: this.postCopy });
      this.postCopy.text = "";
      this.formKey = Math.random();
    },
  },
};
</script>

<style scoped></style>
