<template>
  <div class="about">
    <h1>This is the test page</h1>
  </div>

  <div>
    <div>
      <p>{{ firstName + " " + lastName }}</p>
    </div>
    <user-name v-model:first-name="firstName" v-model:last-name="lastName" />
  </div>
</template>

<script>
import { ref } from "vue";
import UserName from "@/components/UserName";

export default {
  name: "Test",

  components: {
    UserName,
  },

  setup() {
    const firstName = ref("John");
    const lastName = ref("Doe");

    return {
      firstName,
      lastName,
    };
  },
};
</script>

<style scoped></style>
