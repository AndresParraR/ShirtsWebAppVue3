import { ref } from "vue";

export const loginRegisterComs = ref({
  isLoginUp: false,
  setIsLoginUp(value: boolean) {
    this.isLoginUp = value;
  },
});
