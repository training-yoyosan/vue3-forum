<template>
  <span :title="dateForHumans(timestamp)">
    {{ diffForHumans(timestamp) }}
  </span>
</template>

<script>
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);

export default {
  name: "AppDate",

  props: {
    timestamp: {
      required: true,
      type: Number,
    },
  },

  methods: {
    diffForHumans(timestamp) {
      return dayjs.unix(timestamp).fromNow();
    },
    dateForHumans(timestamp) {
      return dayjs.unix(timestamp).format("llll");
    },
  },
};
</script>

<style scoped></style>
