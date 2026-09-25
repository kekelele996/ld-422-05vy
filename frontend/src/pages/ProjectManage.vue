<template>
  <section>
    <StatusBadge value="Active" />
    <ProgressBar :used="315000" :total="880000" />
    <Timeline :items="[]" />
  </section>
</template>

<script setup lang="ts">
import StatusBadge from "../components/common/StatusBadge.vue";
import ProgressBar from "../components/common/ProgressBar.vue";
import Timeline from "../components/common/Timeline.vue";
</script>
