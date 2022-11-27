<template>
  <div style="width: 900px">
    <h1 class="text-center">{{ isBuy ? "Buy" : "Sell" }} T-Shirt</h1>
    <div
      class="mt-16"
      style="
        display: grid;
        gap: 5rem;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
      "
    >
      <div style="display: grid; justify-items: center">
        <!-- <img :src="" /> -->
        <v-img
          :aspect-ratio="1"
          :width="300"
          :src="tempImg"
          contain
        ></v-img>
      </div>
      <div style="display: grid; align-items: center">
        <v-form ref="form" v-model="valid" lazy-validation>
          <div v-if="!isBuy">
            <h3 class="mb-7">Base Price: ${{ basePrice }}</h3>
            <!-- <h3 class="mb-7 mt-5">Shipping: $5234</h3> -->
            <v-text-field
              label="Amount"
              v-model="userPrice"
              :rules="priceRules"
              type="number"
              prefix="$"
              required
            ></v-text-field>
          </div>

          <div v-else-if="isBuy">
            <h3 class="mb-3">Size</h3>
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
            <v-text-field
              v-model="quantity"
              :rules="quantityRules"
              :max="6"
              label="Quantity"
              type="number"
              variant="outlined"
              required
            ></v-text-field>
            <v-text-field
              v-model="address"
              :counter="10"
              :rules="addressRules"
              label="Address"
              required
            ></v-text-field>
          </div>

          <h2 class="mb-10 mt-7">
            Total: ${{ parseInt(userPrice) + parseInt(basePrice) }}
          </h2>

          <v-btn
            :disabled="!valid"
            color="primary"
            class="mr-4"
            @click="validate"
          >
            Submit
          </v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useActions, useState } from "@/utils/helpesVuex";

export default {
  props: {
    isBuy: {
      type: Boolean,
      required: true,
    },
    setData: {
      type: Function,
      required: false,
    },
    tempImg: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    valid: true,
    basePrice: 22000,
    userPrice: 0,
    priceRules: [
      (v) => !!v || "Price is required",
      (v) => (v && v.length <= 10) || "Price must be less than 10 characters",
    ],
    address: "",
    addressRules: [
      (v) => !!v || "Address is required",
      (v) => (v && v.length <= 10) || "Address must be less than 10 characters",
    ],
  }),
  setup() {
    const { fetchAllSizes } = useActions(["fetchAllSizes"]);
    const { sizes } = useState(["sizes"]);

    onMounted(() => {
      fetchAllSizes();
    });

    watch(sizes, (value) => {
      if (value.length > 0) selection.value = value[0]._id;
    });

    const quantity = ref(1);
    const selection = ref("");
    const quantityRules = ref([
      (v) => !!v || "El campo es requerido",
      (v) => /^[0-9]{1,6}$/.test(v) || "No debe tener mas de 6 digitos",
      (v) => v > 0 || "No debe ser menos de 1",
    ]);

    return { quantity, quantityRules, sizes, selection };
  },

  methods: {
    sendRegister() {
      this.linkRegister && this.linkRegister(false);
    },
    validate() {
      this.$refs.form.validate();
      this.setData({
        price: this.userPrice,
        sizeId: this.selection,
        quantity: parseInt(this.quantity),
      });
    },
  },
};
</script>
