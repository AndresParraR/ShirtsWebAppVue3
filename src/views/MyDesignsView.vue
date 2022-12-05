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
          v-for="(shirt, i) in myShirts"
          :edit="true"
          @click="gotToEdit(shirt)"
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
import { useRouter, useRoute } from "vue-router";

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

    const router = useRouter();
    const route = useRoute();

    onMounted(async () => {
      handleGenericLoading(true);
      await fetchMyShirtsList();
      handleGenericLoading(false);
    });

    const gotToEdit = (shirt: any) => {
      console.log("gotToEdit", shirt);
      router.push({ name: "editor", params: { id: shirt._id, colour: shirt.colourId, edit: "true" } });
    };

    const page = ref(1);

    return { page, gotToEdit, myShirts, genericLoading };
  },
});
</script>
