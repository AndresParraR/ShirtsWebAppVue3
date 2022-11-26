<template>
  <div class="container-base">
    <!-- <h1 class="mb-16">{{ id }}</h1> -->
    <!-- {{ detailShirt.design }} -->
    <div class="product-container">
      <!-- <v-card class="mx-auto" max-width="344" v-if="detailShirt">
        <v-img :src="detailShirt.design" height="200px" cover></v-img>
      </v-card> -->
      <!-- <div v-if="detailShirt">
        <img :src="detailShirt.design" />
      </div> -->
      <!-- <v-card
        max-width="400"
        class="mx-auto design-container"
        cols="12"
        v-if="detailShirt"
      >
        <v-img
          :src="detailShirt.design"
          class="align-end text-white"
          width="100%"
          cover
        >
        </v-img>
      </v-card> -->
      <div class="design-container" v-if="detailShirt">
        <div
          class="product-img"
          :style="`background-image: url(${detailShirt.design})`"
        ></div>
        <!-- <v-img
          class="align-end"
          height="100%"
          :src="detailShirt.design"
          width="300"
          cover
        ></v-img> -->
      </div>
      <ProductDetail
        v-if="detailShirt"
        :shirtData="detailShirt"
        class="detail-product"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useActions, useState } from "@/utils/helpesVuex";
import { defineComponent, onMounted, ref } from "vue";

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
  setup(props) {
    const { fetchShirt, handleGenericLoading } = useActions([
      "fetchShirt",
      "handleGenericLoading",
    ]);
    const { detailShirt } = useState(["detailShirt"]);

    onMounted(async () => {
      handleGenericLoading(true);
      await fetchShirt(props.id);
      handleGenericLoading(false);
    });

    return { fetchShirt, detailShirt, handleGenericLoading };
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
.product-img {
  height: 100%;
  min-width: 500px;
  background-size: 100% 100%;
}
</style>
