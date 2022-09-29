<template>
  <!-- <nav> -->
  <!-- <v-app>
      <v-app-bar color="red" class="flex-grow-0" app dark>
        <v-app-bar-title>Coding Beauty</v-app-bar-title>
      </v-app-bar>
      <v-navigation-drawer app right>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              Learning Vuetify
            </v-list-item-title>
            <v-list-item-subtitle> Navigation drawers</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense nav>
          <v-list-item v-for="item in items" :key="item.title" link>
            <v-list-item-icon>
              {{ item.icon }}
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-app> -->
  <v-app-bar
    style="left: 0"
    class="expandedBar"
    color="white"
    dark
    warning-light
    app
    :class="{ unexpandedBar: !drawer }"
  >
    <v-app-bar-nav-icon
      @click.stop="drawer = !drawer"
      style="border: none"
      class="link-navbar"
    ></v-app-bar-nav-icon>
    <h1 class="ml-16" style="font-size: 20px">T-Shirts</h1>
    <v-spacer></v-spacer>
    <v-divider
      class="mx-4 my-auto divider-nav"
      vertical
      style="border-color: #fff; height: 4em"
    ></v-divider>
    <!-- <p>User: {{ user }}</p> -->
    <router-link to="/editor">
      <v-btn
        v-if="!user"
        variant="outlined"
        color="primary"
        prepend-icon="fa-solid fa-wand-magic-sparkles"
      >
        Start to Design
      </v-btn>
    </router-link>
    <v-btn class="text-none" stacked>
      <v-badge content="9" color="info" floating>
        <v-icon size="small">fa-solid fa-cart-shopping</v-icon>
      </v-badge>
    </v-btn>
    <v-btn class="text-none" stacked>
      <v-badge content="9" color="info" floating>
        <v-icon size="small">fa-solid fa-bell</v-icon>
      </v-badge>
    </v-btn>

    <v-menu open-on-hover location="bottom" v-if="user">
      <template v-slot:activator="{ props }">
        <v-avatar
          style="cursor: pointer"
          class="ml-5"
          size="small"
          large
          color="black"
          v-bind="props"
          ><span class="text-white text-h7">CJ</span>
        </v-avatar>
      </template>

      <v-list>
        <template v-for="(item, index) in items" :key="index">
          <v-list-item :value="item.title" @click="drawerSettings = true">
            <v-list-item-avatar start>
              <v-icon size="small">{{ item.icon }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
          <v-divider
            class="mx-4"
            v-if="item.title === 'My account'"
          ></v-divider>
        </template>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    dark
    app
    class="background-navbar"
    :class="{ unexpanded: !drawer }"
    style="
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
        0px 4px 5px 0px rgba(0, 0, 0, 0.14),
        0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    "
  >
    <div
      class="d-flex ml-2 align-center logoNav"
      style="margin-bottom: 5em"
    ></div>
    <v-list nav dense>
      <v-list-item
        v-for="(link, i) in links"
        :key="i"
        :value="link.text"
        active-color="primary"
        router
        :to="link.route"
      >
        <v-list-item-avatar start>
          <!-- <font-awesome-icon icon="fa-clothes-hanger" /> -->
          <v-icon size="small">{{ link.icon }}</v-icon>
        </v-list-item-avatar>

        <v-list-item-title v-text="link.text"></v-list-item-title>
      </v-list-item>
    </v-list>
    <!-- <v-list-item
      v-for="link in links"
      :key="link.text"
      small
      :prepend-icon="link.icon"
      :title="link.text"
      :value="link.text"
    ></v-list-item> -->
  </v-navigation-drawer>

  <v-navigation-drawer
    v-model="drawerSettings"
    location="right"
    style="z-index: 1020; margin-top: 0; height: 100%"
    temporary
  >
    <v-list-item
      prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
      title="John Leider"
    ></v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi:mdi-view-dashboard"
        title="Home"
        value="home"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi:mdi-forum"
        title="About"
        value="about"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- <v-snackbar v-model="$store.state.toast.isActive" :timeout="10000" :top="true" :right="true" :multi-line="true" :color="$store.state.toast.color"><h1 style="font-size: 16px">{{$store.state.toast.msgToast}}</h1></v-snackbar> -->
  <!-- </nav> -->
</template>

<script setup lang="ts">
import { useState } from "@/utils/helpesVuex";
import { ref, onMounted, computed, watch, defineComponent } from "vue";

const { user } = useState(["user"]);

onMounted(() => {
  if (!user.value) {
    links.value = links.value.filter((el) => {
      switch (el.text) {
        case "Shirts":
        case "Editor":
          return el;
      }
    });
  }
});

const drawer = ref(false);
const drawerSettings = ref(false);
const links = ref([
  { icon: "fa-solid fa-house", text: "Shirts", route: "/" },
  {
    icon: "fa-solid fa-shirt",
    text: "My Designs",
    route: "/myDesigns",
  },
  { icon: "fa-solid fa-pen-ruler", text: "Editor", route: "/editor" },
  { icon: "fa-solid fa-bag-shopping", text: "Sells", route: "/sells" },
  { icon: "fa-solid fa-tag", text: "Orders", route: "/orders" },
]);
const items = ref([
  { title: "My account", icon: "mdi:mdi-account-circle" },
  { title: "Add another account", icon: "fa-solid fa-user-plus" },
  { title: "Settings", icon: "mdi:mdi-cog" },
  { title: "Logout", icon: "fa-solid fa-right-from-bracket" },
]);
</script>

<!-- <style scoped>
/* .btn-nav{
  color: #FFF !important;
} */
.img-rosario {
  max-width: 40px;
  height: 40px;
}
.icon-navbar {
  height: 24px;
  width: 24px;
}
.expandedBar {
  transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  background: transparent linear-gradient(282deg, #2962ffcc 0%, #00175f 100%) 0%
    0% no-repeat padding-box;
}
.unexpandedBarIcon {
  margin-left: -7em !important;
}
.unexpandedBarText {
  transform: scale(0);
}
@media (min-width: 960px) {
  .unexpanded {
    width: 80px !important;
    transform: translateX(0%) !important;
    visibility: visible !important;
  }
  .unexpanded-icon {
    margin: auto !important;
    padding-left: 10px;
  }
  .unexpanded-text {
    transform: scale(0) !important;
  }
  .unexpandedBar {
    padding-left: 80px !important;
  }
  .logoNav {
    display: none !important;
  }
}
</style>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button,
input[type="number"] {
  appearance: none;
}

.link-navbar {
  color: #fff !important;
}
.background-navbar {
  background: linear-gradient(282deg, #00175f 0%, #2962ffcc 100%) 0% 0%
    no-repeat padding-box !important;
}
.background-btn {
  background-color: #fff !important;
}
</style> -->
