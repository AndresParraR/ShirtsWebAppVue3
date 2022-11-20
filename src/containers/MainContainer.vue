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
      @handleDialog="handleDialogStep($event)"
      :dialog="dialogSteps"
      :pastSteps="steps"
    />

    <v-overlay
      :model-value="genericLoading"
      class="align-center justify-center"
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
      :timeout="4000"
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
import Navbar from "../components/Navbar.vue";
import { useActions, useState } from "@/utils/helpesVuex";
import { ref } from "vue";
import { StepProp } from "@/types";
import DialogFullScreen from "../components/DialogFullScreen.vue";
import { storageDesign } from "@/firebase";
import { listAll } from "firebase/storage";

export default {
  components: {
    Navbar,
    DialogFullScreen,
    // Footer,
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
    const { toast, genericLoading, dialogSteps } = useState([
      "toast",
      "genericLoading",
      "dialogSteps",
    ]);
    const { handleDialogStep } = useActions(["handleDialogStep"]);

    const steps = ref<StepProp[]>([
      {
        component: "Login",
        tutorial: false,
      },
    ]);

    // const handleDialogStep = (val: boolean) => {
    //   console.log("handleDialogStep", val);
    //   dialogSteps.value = val;
    // };

    // eslint-disable-next-line vue/no-dupe-keys
    return { steps, dialogSteps, toast, genericLoading, handleDialogStep };
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
