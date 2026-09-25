<template>
  <el-steps :active="active" finish-status="success">
    <el-step title="撰写" />
    <el-step title="提交" />
    <el-step title="审核" />
  </el-steps>
</template>

<script setup lang="ts">
defineProps<{ active: number }>();
</script>
