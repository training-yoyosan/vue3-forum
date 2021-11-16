<template>
  <div>
    <input
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)"
    />
  </div>

  <div>
    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "UserName",

  emits: ["update:firstName", "update:lastName"],

  props: {
    firstName: String,
    lastName: String,
  },
};
</script>

<style scoped></style>
