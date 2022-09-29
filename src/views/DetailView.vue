<template>
  <div class="container-base">
    <!-- <h1 class="mb-16">{{ id }}</h1> -->
    <!-- {{ detailShirt }} -->
    <div class="product-container">
      <div class="design-container">
        <v-img
          style="height: 100%"
          class="bg-white"
          width="300"
          :aspect-ratio="1"
          src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
          cover
        ></v-img>
      </div>
      <ProductDetail :shirtData="detailShirt" class="detail-product" />
    </div>
  </div>
</template>

<script lang="ts">
import { useActions, useState } from "@/utils/helpesVuex";
import { defineComponent, ref } from "vue";

export interface Shirt {
  _id: string;
  userId: string;
  design: string;
  userPrice: number;
  isNew: boolean;
  creationDate: string;
}

// Components
import ProductDetail from "../components/ProductDetail.vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  name: "DetailView",
  components: {
    ProductDetail,
  },
  setup() {
    const { fetchShirt } = useActions(["fetchShirt"]);
    const { detailShirt } = useState(["detailShirt"]);

    return { fetchShirt, detailShirt };
  },
  mounted() {
    console.log(this.id);
    this.fetchShirt(this.id);
  },
});
</script>

<style scoped>
.product-container {
  display: grid;
  grid-template-columns: 1fr 0.3fr;
  max-width: 1600px;
}
.design-container {
  display: grid;
  justify-items: center;
  padding: 2em 0;
}
.detail-product {
  width: 100%;
}
</style>
