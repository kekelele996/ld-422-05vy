<template>
  <section class="editor-shell">
    <el-input type="textarea" :model-value="modelValue" placeholder="记录实验步骤，支持表格、图片和公式片段" />
  </section>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();
</script>
