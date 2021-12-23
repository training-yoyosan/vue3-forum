<template>
  <span :title="dateForHumans">
    {{ diffForHumans }}
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
      type: [Number, Object],
    },
  },

  computed: {
    normalizedTimestamp() {
      return this.timestamp?.seconds || this.timestamp;
    },
    diffForHumans() {
      return dayjs.unix(this.normalizedTimestamp).fromNow();
    },
    dateForHumans() {
      return dayjs.unix(this.normalizedTimestamp).format("llll");
    },
  },
};
</script>

<style scoped></style>
