<template>
  <div class="container-base">
    <div class="container-car" v-if="shops.length > 0 && !genericLoading">
      <div class="contain-items">
        <CarItemDetail
          v-for="(shop, i) in shops"
          :key="i"
          :shirtData="shop.product"
          :quantity="shop.quantity"
          :size="shop.sizeId"
          :edit="false"
        />
      </div>
    </div>
    <div v-else-if="!genericLoading">
      <h1>There is not products in Shopping!</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { useActions, useState } from "@/utils/helpesVuex";
import { defineComponent, onMounted, ref } from "vue";

// Components
import CarItemDetail from "../components/CarItemDetail.vue";

export default defineComponent({
  name: "CarView",
  components: {
    CarItemDetail,
  },
  setup() {
    const { fetchAllMyShops, handleGenericLoading } = useActions([
      "fetchAllMyShops",
      "handleGenericLoading",
    ]);
    const { storeId, shops, genericLoading } = useState([
      "storeId",
      "shops",
      "genericLoading",
    ]);

    onMounted(async () => {
      if (shops.value.length < 1) {
        handleGenericLoading(true);
        await fetchAllMyShops();
        handleGenericLoading(false);
      }
    });

    return { storeId, shops, fetchAllMyShops, genericLoading };
  },
});
</script>

<style scoped>
.container-car {
  display: flex;
  flex-direction: column;
}
.contain-items {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 3rem;
}
</style>
