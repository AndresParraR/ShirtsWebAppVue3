<template>
  <v-card class="mx-auto">
    <v-card-text>
      <div v-if="shirtData.isNew">New</div>
      <p class="text-h4 text--primary">{{ shirtData.title }}</p>
      <p class="text--primary mb-3">{{ shirtData.description }}</p>
      <p>$ {{ shirtData.finalPrice }}</p>
    </v-card-text>
    <v-card-actions class="d-block">
      <v-chip-group
        v-model="selection"
        class="mb-5"
        active-class="deep-purple--text text--accent-4"
        mandatory
      >
        <v-chip color="primary" v-for="size in sizes" :key="size" :value="size">
          {{ size }}
        </v-chip>
      </v-chip-group>
      <p class="mb-5">60 available</p>
      <v-text-field
        v-model="quantity"
        :max="60"
        label="Quantity"
        type="number"
        variant="outlined"
        required
      ></v-text-field>
      <div class="container-action-buttons mb-2">
        <v-btn variant="elevated" size="large" color="primary"> Buy now </v-btn>
        <v-btn variant="elevated" size="large" color="primary"> Add car </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { ref, onMounted, computed, watch, defineComponent } from "vue";

export interface ProductShirt {
  _id: string;
  userId: string;
  design: string;
  userPrice: number;
  finalPrice: number;
  title: string;
  description: string;
  isNew: boolean;
  creationDate: string;
}

export default {
  props: {
    // edit: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    shirtData: {
      type: Object as () => ProductShirt,
      required: false,
    },
  },
  data: () => ({
    selection: "M",
    sizes: ["XS", "S", "M", "L", "XL"],
    quantity: 1,
  }),
};
</script>

<style scoped>
.container-action-buttons {
  display: grid;
  row-gap: 10px;
}

.container-action-buttons button {
  margin: 0 !important;
}
</style>
