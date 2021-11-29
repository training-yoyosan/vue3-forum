<template>
  <div class="forum-list" v-for="category in categories" :key="category.id">
    <h2 class="list-title">
      <router-link :to="{ name: 'Category', params: { id: category.id } }"
        >{{ category.name }}
      </router-link>
    </h2>

    <ForumList :forums="getForums(category)" />
  </div>
</template>

<script>
import ForumList from "@/components/ForumList";

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
      return category.forums.map((forumId) =>
        this.$store.state.forums.find((forum) => forum.id === forumId)
      );
    },
  },
};
</script>

<style scoped></style>
