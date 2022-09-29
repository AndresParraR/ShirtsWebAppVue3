<template>
  <div class="container-base">
    <h1 class="mb-16">Sells</h1>
    <DataTable />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

// Components
import DataTable from "../components/DataTable.vue";

export default defineComponent({
  name: "SellsView",
  components: {
    DataTable,
  },
});
</script>
