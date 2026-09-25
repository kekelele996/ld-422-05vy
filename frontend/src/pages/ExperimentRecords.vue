<template>
  <section>
    <StepIndicator :active="1" />
    <RichTextEditor model-value="" />
  </section>
</template>

<script setup lang="ts">
import StepIndicator from "../components/common/StepIndicator.vue";
import RichTextEditor from "../components/editor/RichTextEditor.vue";
</script>
