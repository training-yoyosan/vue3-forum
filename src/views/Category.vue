<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div class="col-full push-top">
      <h1>{{ category?.name }}</h1>
    </div>

    <div class="col-full">
      <CategoryList :categories="category ? [category] : []" />
    </div>
  </div>
</template>

<script>
import CategoryList from "@/components/CategoryList";
import { findById } from "@/helpers";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  name: "Category",

  components: { CategoryList },

  mixins: [asyncDataStatus],

  props: {
    id: {
      required: true,
      type: Number,
    },
  },

  computed: {
    category() {
      return findById(this.$store.state.categories.items, this.id) || undefined;
    },
  },

  methods: {
    ...mapActions("categories", ["fetchCategory"]),
    ...mapActions("forums", ["fetchForums"]),
  },

  async created() {
    const category = await this.fetchCategory({
      id: this.id,
    });
    await this.fetchForums({ ids: category.forums });
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped></style>
