<template>
  <section>
    <StockAlert name="无水乙醇" :stock="4.5" :min-stock="5" />
    <StatusBadge value="Flammable" />
  </section>
</template>

<script setup lang="ts">
import StockAlert from "../components/common/StockAlert.vue";
import StatusBadge from "../components/common/StatusBadge.vue";
</script>
