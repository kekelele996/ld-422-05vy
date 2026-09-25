<template>
  <el-progress :percentage="percentage" :status="percentage > 90 ? 'exception' : 'success'" />
</template>

<script setup lang="ts">
const props = defineProps<{ used: number; total: number }>();
const percentage = Math.min(100, Math.round((props.used / props.total) * 100));
</script>
