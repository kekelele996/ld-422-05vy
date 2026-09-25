<template>
  <el-alert v-if="stock < minStock" type="error" show-icon :closable="false" :title="`${name} 库存低于阈值`" />
</template>

<script setup lang="ts">
defineProps<{ name: string; stock: number; minStock: number }>();
</script>
