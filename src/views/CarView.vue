<template>
  <div class="container-base">
    <div class="container-car" v-if="storeItems.length > 0 && !genericLoading">
      <div class="contain-items">
        <CarItemDetail
          v-for="(shirt, i) in storeItems"
          :key="i"
          :shirtData="shirt"
          :quantity="getSizeQuantity(shirt._id, 1)"
          :size="getSizeQuantity(shirt._id, 2)"
          :edit="true"
        />
      </div>
      <v-btn
        class="mt-16"
        style="align-self: flex-end"
        variant="elevated"
        size="large"
        color="primary"
      >
        Comprar
      </v-btn>
    </div>
    <div v-else-if="!genericLoading">
      <h1>There is not products in Car!</h1>
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
    const { fetchShirtStore, handleGenericLoading } = useActions([
      "fetchShirtStore",
      "handleGenericLoading",
    ]);
    const { storeId, storeItems, genericLoading } = useState([
      "storeId",
      "storeItems",
      "genericLoading",
    ]);

    const sleep = (ms: any) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    onMounted(async () => {
      if (storeId.value.length > 0) {
        handleGenericLoading(true);
        const shirtsStorePromises = storeId.value.map(async (el: any) => {
          const fetch = await sleep(5000).then(() => fetchShirtStore(el.id));
          return fetch;
        });
        const result = await Promise.all(shirtsStorePromises);
        console.log(result);
        handleGenericLoading(false);
      }
    });

    const getSizeQuantity = (id: string, type: number): any => {
      const item = storeId.value.find((el: any) => el.id == id);
      switch (type) {
        case 1:
          return item.quantity;
        case 2:
          return item.size;
        default:
          return null;
      }
    };

    return {
      getSizeQuantity,
      storeId,
      storeItems,
      fetchShirtStore,
      genericLoading,
    };
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
