<template>
  <div class="container-base">
    <div v-if="allShirts.length >= 1 && !genericLoading">
      <div style="display: grid; justify-content: flex-end">
        <v-text-field
          style="width: 250px"
          label="Search"
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          variant="outlined"
        ></v-text-field>
      </div>
      <!-- {{ allShirts }} -->
      <div class="container-shirts">
        <Shirt
          v-for="(shirt, i) in allShirts"
          @click="$router.push({ name: 'detail', params: { id: shirt._id } })"
          :shirtData="shirt"
          :key="i"
        />
      </div>
      <div class="mt-16 text-center">
        <v-pagination
          v-if="allShirts.length / 8 > 1"
          v-model="page"
          :length="allShirts.length / 8"
          :total-visible="7"
        ></v-pagination>
      </div>
    </div>
    <div style="" v-else-if="!genericLoading">
      <h1>There is not T-Shirts!</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { useActions, useState } from "@/utils/helpesVuex";
import { defineComponent, onMounted, ref } from "vue";

// Components
import Shirt from "../components/Shirt.vue";

export default defineComponent({
  name: "ShirtsView",
  components: {
    Shirt,
  },
  setup() {
    const { fetchAllShirtsList, handleGenericLoading } = useActions([
      "fetchAllShirtsList",
      "handleGenericLoading",
    ]);
    const { allShirts, user, genericLoading } = useState([
      "allShirts",
      "user",
      "genericLoading",
    ]);
    const page = ref(1);

    onMounted(async () => {
      handleGenericLoading(true);
      await fetchAllShirtsList();
      handleGenericLoading(false);
    });

    return { page, allShirts, user, fetchAllShirtsList, genericLoading };
  },
});
</script>

<style></style>
