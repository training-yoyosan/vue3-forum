<template>
  <VeeForm @submit="save">
    <AppFormField label="Title" name="title" v-model="form.title" rules="required" />
    <AppFormField as="textarea" label="Content" name="text" v-model="form.text" rules="required" rows="8" cols="140" />

    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="$emit('cancel')">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ existing ? "Update" : "Publish" }}
      </button>
    </div>
  </VeeForm>
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
      form: {
        title: this.title,
        text: this.text,
      },
    };
  },

  methods: {
    save() {
      this.$emit("clean");
      this.$emit("save", { ...this.form });
    },
  },

  watch: {
    form: {
      handler() {
        if (this.form.title !== this.title || this.form.text !== this.text) {
          this.$emit("dirty");
        } else {
          this.$emit("clean");
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped></style>
