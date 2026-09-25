<template>
  <el-tag :type="type">{{ value }}</el-tag>
</template>

<script setup lang="ts">
const props = defineProps<{ value: string }>();
const type = ["Active", "Approved", "Safe", "Received"].includes(props.value)
  ? "success"
  : ["Rejected", "Toxic", "Explosive"].includes(props.value)
    ? "danger"
    : ["Cancelled"].includes(props.value)
      ? "info"
      : "warning";
</script>
