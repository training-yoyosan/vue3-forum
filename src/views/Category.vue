<template>
  <div class="col-full push-top">
    <h1>{{ category?.name }}</h1>
  </div>

  <div class="col-full">
    <CategoryList :categories="category ? [category] : []" />
  </div>
</template>

<script>
import CategoryList from "@/components/CategoryList";
import { findById } from "@/helpers";
import { mapActions } from "vuex";

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
      return findById(this.$store.state.categories, this.id) || undefined;
    },
  },

  methods: {
    ...mapActions(["fetchCategory", "fetchForums"]),
  },

  async created() {
    const category = await this.fetchCategory({
      id: this.id,
    });
    this.fetchForums({ ids: category.forums });
  },
};
</script>

<style scoped></style>
