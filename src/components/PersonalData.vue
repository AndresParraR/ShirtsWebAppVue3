<template>
  <div style="width: 900px">
    <h1 class="mb-16 text-center">Personal Data</h1>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="address"
        :counter="10"
        :rules="addressRules"
        label="Address"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="primary" class="mr-4" @click="validate">
        Submit
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    address: "",
    addressRules: [
      (v) => !!v || "Address is required",
      (v) => (v && v.length <= 10) || "Address must be less than 10 characters",
    ],
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>
