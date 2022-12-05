<script lang="ts" setup>
import { useState, useActions } from "@/utils/helpesVuex";
import { watch, defineProps, defineEmits, defineExpose, ref } from "vue";

const { register } = useActions(["register"]);
const { user } = useState(["user"]);

const props = defineProps({
  linkRegister: {
    type: Function,
    required: false,
  },
  finishedFunc: {
    type: Function,
    required: false,
  },
});

const emit = defineEmits<{
  (e: "switchComponent", data: boolean): void;
  (e: "done"): void;
}>();

watch(user, (value) => {
  console.log(value, props);
  if (value) emit("done");
});

const form = ref(null);
const valid = ref(true);
const password = ref("");
const confirmPassword = ref("");
const passwordRules = ref([
  (v: any) => !!v || "Password is required",
  (v: any) =>
    (v && v.length <= 10) || "Password must be less than 10 characters",
]);
const checkbox = ref(false);
const email = ref("");
const confirmEmail = ref("");
const emailRules = ref([
  (v: any) => !!v || "E-mail is required",
  (v: any) => /.+@.+\..+/.test(v) || "E-mail must be valid",
]);

const sendLogin = () => {
  emit("switchComponent", false);
};

const validate = () => {
  register({ email: email.value, password: password.value });
  (form.value as any).validate();
};

defineExpose({ submit: validate });
</script>

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
        type="password"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        :counter="10"
        :rules="passwordRules"
        label="Confirm Password"
        required
        type="password"
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
