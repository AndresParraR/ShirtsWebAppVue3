<template>
  <div class="container-base">
    <div v-if="myShirts.length < 1 && !genericLoading">
      <h1>Start to Design!</h1>
    </div>
    <div v-else-if="!genericLoading">
      <div style="display: grid; justify-content: flex-end">
        <v-text-field
          style="width: 250px"
          label="Search"
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          variant="outlined"
        ></v-text-field>
      </div>
      <div class="container-shirts">
        <Shirt
          :edit="true"
          v-for="(shirt, i) in myShirts"
          :shirtData="shirt"
          :key="i"
        />
      </div>
      <div class="text-center">
        <v-pagination
          v-if="myShirts.length / 8 > 1"
          v-model="page"
          :length="myShirts.length / 8"
          :total-visible="7"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useActions, useState } from "@/utils/helpesVuex";
import { defineComponent, onMounted, ref } from "vue";

// Components
import Shirt from "../components/Shirt.vue";

export default defineComponent({
  name: "MyDesignsView",
  components: {
    Shirt,
  },
  setup() {
    const { fetchMyShirtsList, handleGenericLoading } = useActions([
      "fetchMyShirtsList",
      "handleGenericLoading",
    ]);

    const { myShirts, genericLoading } = useState([
      "myShirts",
      "genericLoading",
    ]);

    onMounted(async () => {
      handleGenericLoading(true);
      await fetchMyShirtsList();
      handleGenericLoading(false);
    });

    const page = ref(1);

    return { page, myShirts, genericLoading };
  },
});
</script>
