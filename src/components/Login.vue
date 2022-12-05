<script lang="ts" setup>
import { useState, useActions } from "@/utils/helpesVuex";
import { watch, defineProps, defineEmits, defineExpose, ref } from "vue";

const { login } = useActions(["login"]);
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
const passwordRules = ref([
  (v: any) => !!v || "Password is required",
  // (v) =>
  //   (v && v.length <= 10) || "Password must be less than 10 characters",
]);
const email = ref("");
const emailRules = ref([
  (v: any) => !!v || "E-mail is required",
  (v: any) => /.+@.+\..+/.test(v) || "E-mail must be valid",
]);

const sendRegister = () => {
  emit("switchComponent", true);
};

const validate = () => {
  login({ email: email.value, password: password.value });
  (form.value as any).validate();
};

defineExpose({ submit: validate });
</script>

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
        type="password"
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
