<template>
  <div class="fill-height">
    <Navbar />

    <!-- <v-container fluid> -->
    <!-- <transition name="fade" mode="out-in">
      <keep-alive> -->
    <router-view />

    <!-- </keep-alive>
    </transition> -->
    <!-- </v-container> -->

    <!-- <Footer/> -->

    <!-- <v-dialog v-model="errGet" max-width="370" persistent>
      <v-card class="pb-2">
        <v-card-title class="headline">Oops! Ha ocurrido un error <br/> intentalo de nuevo mas tarde</v-card-title>
        <v-card-actions class="mt-5 justify-center">
          <v-btn color="red darken-1" text @click="unshow">Bueno</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <!-- <v-alert
      style="top: 10px; right: 20px"
      min-width="300"
      position="absolute"
      type="error"
      >I'm an error alert.</v-alert> -->

    <DialogFullScreen
      ref="stepper"
      @handleDialog="handleDialogStep($event)"
      @updateStep="updateStep($event)"
      :current-step="currentStep"
      :dialog="dialogSteps"
      :pastSteps="steps"
    >
      <v-carousel-item>
        <v-sheet height="100%">
          <div class="d-flex fill-height justify-center align-center">
            <Register
              v-if="isRegister"
              @switchComponent="setIsRegister"
              @done="currentStepCompleted(StepsEnum.LOGINREGISTER)"
            />
            <Login
              v-else
              @switchComponent="setIsRegister"
              @done="currentStepCompleted(StepsEnum.LOGINREGISTER)"
            />
          </div>
        </v-sheet>
      </v-carousel-item>
    </DialogFullScreen>

    <!-- <DialogFullScreen
      @handleDialog="handleDialogStep($event)"
      :dialog="dialogSteps"
      :pastSteps="steps"
    /> -->

    <v-overlay
      :model-value="genericLoading"
      class="align-center justify-center loader"
    >
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-overlay>

    <v-snackbar
      v-model="toast.show"
      min-height="50"
      :timeout="2000"
      position="fixed"
      location="top right"
      :multi-line="false"
      :color="toast.status"
    >
      <v-alert density="compact" :type="toast.status">
        {{ toast.message }}
      </v-alert>
      <!-- <div style="display: flex; align-items: center">
        <v-icon size="large" style="margin-inline-end: 16px"
          >mdi:mdi-close-circle</v-icon
        >
        <h1 style="font-size: 16px">{{ toast.message }}</h1>
      </div> -->
    </v-snackbar>
    <!--
    <v-speed-dial
      v-if="$store.state.dataAuth.roleName == 'Client'"
      class="speed-dial"
      v-model="fab"
      :direction="'top'"
      :transition="'scale-transition'"
      :open-on-hover="true">
      <template v-slot:activator>
        <v-btn
          id="btn-float"
          v-model="fab"
          dark
          fab >
          <v-icon class="icon-float" v-if="fab">mdi-close</v-icon>
          <v-icon class="icon-float" v-else>fas fa-question</v-icon>
        </v-btn>
      </template>
      <v-btn
        id="btn-float"
        @click="newQuotation"
        dark
        fab >
        <v-icon class="icon-float">fas fa-file-invoice-dollar</v-icon>
      </v-btn>
      <v-btn
        id="btn-float"
        dark
        fab 
        href="mailto:info@qualitascolombia.com">
        <v-icon class="icon-float">fas fa-user-tie</v-icon>
      </v-btn>
    </v-speed-dial> -->
  </div>
</template>

<script lang="ts">
import Navbar from "@/components/Navbar.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import { useActions, useState } from "@/utils/helpesVuex";
import { ref } from "vue";
import { StepProp } from "@/types";
import DialogFullScreen from "../components/DialogFullScreen.vue";
import { storageDesign } from "@/firebase";
import { listAll } from "firebase/storage";
import { StepsEnum } from "@/types";

export default {
  components: {
    Navbar,
    DialogFullScreen,
    Login,
    Register,
  },
  mounted() {
    console.log(storageDesign);
    listAll(storageDesign)
      .then((res) => {
        console.log("storageRef", res);
        // res.prefixes.forEach((folderRef) => {
        //   // All the prefixes under listRef.
        //   // You may call listAll() recursively on them.
        // });
        // res.items.forEach((itemRef) => {
        //   // All the items under listRef.
        // });
      })
      .catch((error) => {
        console.log("storageRefError", error);
        // Uh-oh, an error occurred!
      });
  },
  data() {
    return {
      collapseNavbar: false,
      fab: false,
      urlQualitas: process.env.VUE_APP_API_URL_QUALITAS,
    };
  },
  setup() {
    const { toast, genericLoading, dialogSteps, user } = useState([
      "toast",
      "genericLoading",
      "dialogSteps",
      "user",
    ]);

    const { handleDialogStep } = useActions(["handleDialogStep"]);

    const isRegister = ref(true);
    const currentStep: any = ref(null);

    const steps: any = ref([
      { step: StepsEnum.LOGINREGISTER, tutorial: false, completed: false },
    ]);

    const updateStep = (value: any) => {
      if (value >= steps.value.length) handleDialogStep(false);

      // if (
      //   value < currentStep.value &&
      //   !steps.value[currentStep.value - 1].tutorial
      // )
      //   return;

      // if (
      //   !steps.value[currentStep.value].completed &&
      //   !steps.value[currentStep.value].tutorial &&
      //   value > currentStep.value
      // )
      //   return;

      // currentStep.value = value;

      validateDialogSteps();
    };

    const currentStepCompleted = (event: any) => {
      const index = steps.value.findIndex((el: any) => el.step == event);
      steps.value[index].completed = true;
      console.log(steps.value);
      updateStep(index + 1);
    };

    const validateDialogSteps = () => {
      if (user.value) {
        steps.value = steps.value.map((el: any) => {
          switch (el.step) {
            case StepsEnum.LOGINREGISTER:
              el.completed = true;
          }
          return el;
        });
      } else {
        steps.value = steps.value.map((el: any) => {
          el.completed = false;
          return el;
        });
      }
      currentStep.value = steps.value.findIndex(
        (el: any) => el.completed == false
      );
    };

    const setIsRegister = (val: boolean) => {
      isRegister.value = val;
    };

    // const handleDialogStep = (val: boolean) => {
    //   console.log("handleDialogStep", val);
    //   dialogSteps.value = val;
    // };

    // eslint-disable-next-line vue/no-dupe-keys
    return {
      steps,
      dialogSteps,
      updateStep,
      setIsRegister,
      currentStep,
      currentStepCompleted,
      toast,
      isRegister,
      genericLoading,
      handleDialogStep,
      StepsEnum,
    };
  },
  computed: {},
  methods: {
    unshow() {
      // this.$store.state.errGet = false;
      // this.$store.commit("GO_LOGIN");
    },
  },
};
</script>
