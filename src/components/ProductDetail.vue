<template>
  <v-card class="mx-auto">
    <v-card-text>
      <!-- <div v-if="shirtData.isNew">New</div> -->
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
        <v-chip
          color="primary"
          v-for="size in sizes"
          :key="size"
          :value="size._id"
        >
          {{ size.name }}
        </v-chip>
      </v-chip-group>
      <p class="mb-5">60 available</p>
      <v-text-field
        v-model="quantity"
        :rules="quantityRules"
        :max="6"
        label="Quantity"
        type="number"
        variant="outlined"
        required
      ></v-text-field>
      <div class="container-action-buttons mb-2">
        <v-btn
          variant="elevated"
          size="large"
          color="primary"
          @click="btnBuyProduct()"
        >
          Buy now
        </v-btn>
        <v-btn
          variant="elevated"
          size="large"
          color="primary"
          @click="addItemToStoreId()"
        >
          Add car
        </v-btn>
      </div>
    </v-card-actions>
    <DialogFullScreen
      @handleDialog="handleDialogStep($event)"
      :dialog="dialogSteps"
      :pastSteps="steps"
    />
  </v-card>
</template>

<script lang="ts">
import { ref, onMounted, computed, watch, defineComponent } from "vue";
import { useActions, useState } from "@/utils/helpesVuex";
import { StepProp } from "@/types";
import DialogFullScreen from "../components/DialogFullScreen.vue";

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

export default defineComponent({
  name: "ProductDetail",
  props: {
    // edit: {
    //   type: Boolean,
    //   required: false,
    //   default: false,
    // },
    shirtData: {
      type: Object as () => ProductShirt,
      required: true,
    },
  },
  components: {
    DialogFullScreen,
  },
  created() {
    console.log(this as any);
    if ((this as any).sizes.length < 1) {
      (this as any).fetchAllSizes();
    } else {
      this.selection = this.sizes[0]._id;
    }
  },
  data: () => ({
    // sizes: ["XS", "S", "M", "L", "XL"],
  }),
  setup(props: any) {
    const { setIdStore, fetchAllSizes, buyProduct } = useActions([
      "setIdStore",
      "fetchAllSizes",
      "buyProduct",
    ]);
    const { user, storeId, sizes } = useState(["user", "storeId", "sizes"]);
    const quantity = ref(1);
    const selection = ref("");
    const dialogSteps = ref(false);
    const steps = ref<StepProp[]>([
      {
        component: "Register",
        tutorial: false,
      },
    ]);

    const quantityRules = ref([
      (v: any) => !!v || "El campo es requerido",
      (v: any) => /^[0-9]{1,6}$/.test(v) || "No debe tener mas de 6 digitos",
      (v: any) => v > 0 || "No debe ser menos de 1",
    ]);

    watch(sizes, (value) => {
      if (value.length > 0) selection.value = value[0]._id;
    });

    const addItemToStoreId = () => {
      setIdStore({
        id: props.shirtData._id,
        quantity: quantity.value,
        size: selection.value,
      });
    };

    const btnBuyProduct = () => {
      console.log("buyProduct", user);
      if (user.value) {
        buyProduct({
          userId: props.shirtData.userId,
          productId: props.shirtData._id,
          sizeId: selection.value,
          quantity: quantity.value,
        });
      } else {
        handleDialogStep(true);
      }
    };

    const handleDialogStep = (val: boolean) => {
      console.log("handleDialogStep", val);
      dialogSteps.value = val;
    };

    return {
      quantityRules,
      quantity,
      selection,
      addItemToStoreId,
      btnBuyProduct,
      setIdStore,
      storeId,
      sizes,
      fetchAllSizes,
      steps,
      dialogSteps,
      handleDialogStep,
    };
  },
});
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
