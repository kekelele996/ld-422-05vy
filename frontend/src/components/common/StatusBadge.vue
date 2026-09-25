<template>
  <el-tag :type="type">{{ value }}</el-tag>
</template>

<script setup lang="ts">
const props = defineProps<{ value: string }>();
const type = ["Active", "Approved", "Safe"].includes(props.value) ? "success" : ["Rejected", "Toxic", "Explosive"].includes(props.value) ? "danger" : "warning";
</script>
