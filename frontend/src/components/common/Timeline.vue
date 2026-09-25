<template>
  <el-timeline>
    <el-timeline-item v-for="item in items" :key="item.id" :timestamp="item.experimentDate">{{ item.title }}</el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
import type { ExperimentRecord } from "../../types/experiment";
defineProps<{ items: ExperimentRecord[] }>();
</script>
