<template>
  <div class="col-full push-top">
    <h1>{{ category.name }}</h1>
  </div>

  <div class="col-full">
    <CategoryList :categories="[category]" />
  </div>
</template>

<script>
import CategoryList from "@/components/CategoryList";
import { findById } from "@/helpers";

export default {
  name: "Category",

  components: { CategoryList },

  props: {
    id: {
      required: true,
      type: Number,
    },
  },

  computed: {
    category() {
      return findById(this.$store.state.categories, this.id);
    },
  },

  methods: {},
};
</script>

<style scoped></style>
