<template>
  <div style="width: 900px">
    <h1 class="mb-16 text-center">Register</h1>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>

      <v-text-field
        v-model="confirmEmail"
        :rules="emailRules"
        label="Confirm E-mail"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :counter="10"
        :rules="passwordRules"
        label="Password"
        required
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        :counter="10"
        :rules="passwordRules"
        label="Confirm Password"
        required
      ></v-text-field>

      <div class="d-flex">
        <v-checkbox
          v-model="checkbox"
          :rules="[(v) => !!v || 'You must agree to continue!']"
          label="Do you agree?"
          required
        ></v-checkbox>
        <v-btn variant="text" @click="sendLogin">
          Already Registered? Log in
        </v-btn>
      </div>

      <v-btn :disabled="!valid" color="primary" class="mr-4" @click="validate">
        Submit
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { useActions, useState } from "@/utils/helpesVuex";
import { watch } from "vue";

export default {
  props: {
    linkLogin: {
      type: Function,
      required: false,
    },
    finishedFunc: {
      type: Function,
      required: false,
    },
  },
  data: () => ({
    valid: true,
    password: "",
    confirmPassword: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) =>
        (v && v.length <= 10) || "Password must be less than 10 characters",
    ],
    email: "",
    confirmEmail: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    checkbox: false,
  }),
  setup(props) {
    const { register } = useActions(["register"]);
    const { user } = useState(["user"]);


    watch(user, (value) => {
      console.log(value, props);
      if (value) props.finishedFunc();
    });

    return { register, user };
  },

  methods: {
    sendLogin() {
      this.linkLogin && this.linkLogin(true);
    },
    validate() {
      this.register({ email: this.email, password: this.password });
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
