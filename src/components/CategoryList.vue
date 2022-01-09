<template>
  <div class="forum-list" v-for="category in categories" :key="category.id">
    <h2 class="list-title">
      <router-link :to="{ name: 'Category', params: { id: category.id } }">{{ category.name }} </router-link>
    </h2>

    <ForumList :forums="getForums(category)" />
  </div>
</template>

<script>
import ForumList from "@/components/ForumList";
import { findById } from "@/helpers";

export default {
  name: "CategoryList",

  components: { ForumList },

  props: {
    categories: {
      required: true,
      type: Array,
    },
  },

  methods: {
    getForums(category) {
      if (this.$store.state.forums.items.length === 0) {
        return [];
      }

      let forums = category.forums.map((forumId) => findById(this.$store.state.forums.items, forumId));

      for (const forum of forums) {
        if (forum === undefined) {
          forums = [];
          break;
        }
      }

      return forums;
    },
  },
};
</script>

<style scoped></style>
