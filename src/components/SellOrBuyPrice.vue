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
        <v-img
          :aspect-ratio="1 / 1"
          :width="300"
          src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
          cover
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
                :value="size"
              >
                {{ size }}
              </v-chip>
            </v-chip-group>
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
export default {
  props: {
    isBuy: {
      type: Boolean,
      required: true,
    },
    setUserPrice: {
      type: Function,
      required: false,
    },
  },
  data: () => ({
    valid: true,
    selection: "M",
    basePrice: 22000,
    userPrice: 0,
    sizes: ["XS", "S", "M", "L", "XL"],
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

  methods: {
    sendRegister() {
      this.linkRegister && this.linkRegister(false);
    },
    validate() {
      this.$refs.form.validate();
      this.setUserPrice(this.userPrice);
    },
  },
};
</script>
