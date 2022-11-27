<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// import Navbar from "./components/Navbar.vue";

export default defineComponent({
  name: "App",
  components: {
    // Navbar,
  },
  data() {
    return {
      //
    };
  },
});
</script>
<style>
a {
  text-decoration: none !important;
}
.container-base {
  padding: 5rem 4rem;
}
.container-shirts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 7rem;
  justify-items: center;
  /* padding: 2rem 0; */
}
.v-navigation-drawer__scrim {
  z-index: 1018 !important;
}

.v-overlay.v-snackbar {
  z-index: 3002 !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.v-color-picker-swatches__color {
  border: 1px solid #000;
}
.loader {
  z-index: 9999 !important;
}
</style>
