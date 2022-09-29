<template>
  <div style="width: 900px">
    <h1 class="mb-16 text-center">Login</h1>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :counter="10"
        :rules="passwordRules"
        label="Password"
        required
      ></v-text-field>

      <div class="d-flex mb-16">
        <v-btn variant="text" @click="sendRegister">
          You don't have an account? Sign up
        </v-btn>
      </div>

      <v-btn :disabled="!valid" color="primary" class="mr-4" @click="validate">
        Submit
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { useState, useActions } from "@/utils/helpesVuex";
import { watch } from "vue";

export default {
  props: {
    linkRegister: {
      type: Function,
      required: false,
    },
  },
  data: () => ({
    valid: true,
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      // (v) =>
      //   (v && v.length <= 10) || "Password must be less than 10 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
  }),
  setup(props) {
    const { login } = useActions(["login"]);
    const { user } = useState(["user"]);

    watch(user, (value) => {
      console.log(value, props);
      if (value) props.finishedFunc();
    });
    return { login };
  },

  methods: {
    sendRegister() {
      this.linkRegister && this.linkRegister(false);
    },
    validate() {
      this.login({ email: this.email, password: this.password });
      this.$refs.form.validate();
    },
  },
};
</script>
