<template>
  <el-tag :type="type">{{ label || value }}</el-tag>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ value: string; label?: string }>();
const type = computed(() => {
  if (["Active", "Approved", "Safe", "Received"].includes(props.value)) return "success";
  if (["Rejected", "Toxic", "Explosive"].includes(props.value)) return "danger";
  if (["Cancelled", "Archived"].includes(props.value)) return "info";
  return "warning";
});
</script>
