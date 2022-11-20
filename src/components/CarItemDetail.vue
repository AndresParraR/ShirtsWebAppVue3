<template>
  <v-card
    class="mx-auto"
    style="
      position: relative;
      overflow: initial;
      display: grid;
      width: 100%;
      min-height: 150px;
      grid-template-columns: 0fr 4fr 1fr 1fr;
      grid-template-rows: 1fr;
    "
  >
    <v-img
      class="align-end text-white car-img"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      cover
    >
    </v-img>

    <div>
      <v-card-title>{{ shirtData.title }}</v-card-title>

      <v-card-text>
        <div>{{ shirtData.description }}</div>
      </v-card-text>
    </div>

    <div>
      <v-text-field
        v-if="edit"
        label="Quantity"
        v-model="quantityModel"
        :max="60"
        type="number"
        variant="outlined"
      ></v-text-field>

      <v-card-subtitle v-else class="text-h6 pt-4">
        quantity {{ quantityModel }}
      </v-card-subtitle>
    </div>

    <v-card-subtitle class="text-h6 pt-4">
      $ {{ shirtData.finalPrice }}
    </v-card-subtitle>

    <!-- <v-card-actions>
      <v-btn color="orange"> Share </v-btn>

      <v-btn color="orange"> Explore </v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, computed, watch, defineComponent } from "vue";
import { useMutations } from "@/utils/helpesVuex";

export interface Shirt {
  _id: string;
  userId: string;
  design: string;
  title: string;
  description: string;
  finalPrice: number;
  userPrice: number;
  creationDate: string;
}

export default {
  props: {
    shirtData: {
      type: Object as () => Shirt,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    edit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  mounted() {
    (this as any).quantityModel = (this as any).quantity;
  },
  data: () => ({}),
  setup(props: any) {
    const quantityModel = ref(0);

    return { quantityModel };
  },
};
</script>

<style scoped>
.share-social {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
}
.car-img {
  max-width: 200px;
  width: 200px;
}
</style>
