<template>
  <section>
    <StatusBadge value="Active" />
    <StockAlert name="无水乙醇" :stock="4.5" :min-stock="5" />
  </section>
</template>

<script setup lang="ts">
import StatusBadge from "../components/common/StatusBadge.vue";
import StockAlert from "../components/common/StockAlert.vue";
</script>
