<template>
  <div class="container-base">
    <div v-if="myShirts.length < 1">
      <h1>Start to Design!</h1>
    </div>
    <div v-else>
      <div style="display: grid; justify-content: flex-end">
        <v-text-field
          style="width: 250px"
          label="Search"
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          variant="outlined"
        ></v-text-field>
      </div>
      {{ myShirts }}
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
          v-model="page"
          :length="15"
          :total-visible="7"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useActions, useState } from "@/utils/helpesVuex";
import { defineComponent, ref } from "vue";

// Components
import Shirt from "../components/Shirt.vue";

export default defineComponent({
  name: "MyDesignsView",
  components: {
    Shirt,
  },
  mounted() {
    const { fetchMyShirtsList } = useActions(["fetchMyShirtsList"]);
    fetchMyShirtsList();
  },
  setup() {
    const page = ref(1);
    const { myShirts } = useState(["myShirts"]);

    return { page, myShirts };
  },
});
</script>
