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
import sourceData from "@/data.json";

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
      return sourceData.categories.find((cat) => cat.id === this.id);
    },
  },

  methods: {},
};
</script>

<style scoped></style>
