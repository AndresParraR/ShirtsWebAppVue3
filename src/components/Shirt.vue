<template>
  <v-card
    class="mx-auto"
    max-width="400"
    style="position: relative; overflow: initial"
  >
    <v-btn
      v-if="edit"
      icon
      color="primary"
      style="position: absolute; bottom: -20px; right: -20px; z-index: 1"
    >
      <v-icon>fa-solid fa-clone</v-icon>
    </v-btn>

    <v-chip
      v-if="shirtData.isNew"
      color="red"
      label
      text-color="white"
      style="
        background: white;
        position: absolute;
        top: -10px;
        left: -20px;
        z-index: 1;
      "
    >
      <v-icon start icon="fa-solid fa-tags"></v-icon>
      New
    </v-chip>

    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          color="primary"
          v-bind="props"
          style="position: absolute; top: -20px; right: -20px; z-index: 1"
        >
          <v-icon>fa-solid fa-share-nodes</v-icon>
        </v-btn>
      </template>

      <v-btn-toggle color="primary">
        <v-btn color="primary" @click="shareButton(1)">
          <ShareNetwork
            class="share-social"
            network="facebook"
            url="https://news.vuejs.org/issues/180"
            title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
            description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
            quote="The hot reload is so fast it\'s near instant. - Evan You"
            hashtags="vuejs,vite"
          >
            <v-icon>fa-brands fa-facebook</v-icon>
          </ShareNetwork>
        </v-btn>
        <v-btn color="primary" @click="shareButton(2)">
          <ShareNetwork
            class="share-social"
            network="whatsapp"
            url="https://news.vuejs.org/issues/180"
            title="Say hi to Vite! A brand new, extremely fast development setup for Vue."
            description="This week, I’d like to introduce you to 'Vite', which means 'Fast'. It’s a brand new development setup created by Evan You."
          >
            <v-icon>fa-brands fa-whatsapp</v-icon>
          </ShareNetwork>
        </v-btn>
        <v-btn color="primary" @click="shareButton(3)">
          <v-icon>fa-solid fa-link</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-menu>

    <v-card-title class="ma-2">
      {{ shirtData.title }}
    </v-card-title>

    <v-img
      class="align-end text-white"
      height="200"
      :src="shirtData.design"
      cover
    >
      <v-card-title>{{ shirtData.title }}</v-card-title>
    </v-img>

    <v-card-subtitle class="pt-4">
      $ {{ shirtData.finalPrice }}
    </v-card-subtitle>

    <v-card-text>
      <div>{{ shirtData.description }}</div>
    </v-card-text>

    <!-- <v-card-actions>
      <v-btn color="orange"> Share </v-btn>

      <v-btn color="orange"> Explore </v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, computed, watch, defineComponent } from "vue";
import { useMutations } from "@/utils/helpesVuex";

export interface Shirt {
  _id: string;
  userId: string;
  design: string;
  userPrice: number;
  creationDate: string;
}

export default {
  props: {
    edit: {
      type: Boolean,
      required: false,
      default: false,
    },
    shirtData: {
      type: Object as () => Shirt,
      required: true,
    },
  },
  // mounted() {
  //   const currentDate = new Date();
  //   currentDate.setDate(currentDate.getDate() + 7);

  //   const diffDays =
  //     Math.round(
  //       currentDate.getTime() -
  //         new Date((this as any).shirtData.creationDate).getTime()
  //     ) /
  //     (1000 * 3600 * 24);

  //   console.log(
  //     this,
  //     new Date(),
  //     new Date((this as any).shirtData.creationDate),
  //     diffDays
  //   );
  //   (this as any).isNew = diffDays > 7 ? true : false;
  // },
  data: () => ({}),
  setup(props: any) {
    const route = useRoute();

    const { setShowToastInfo } = useMutations(["setShowToastInfo"]);

    const menu = ref(false);
    const toggle = ref(null);

    const shareButton = (type: number) => {
      console.log(
        "shareButton",
        type,
        props.shirtData._id,
        `${window.location.origin}/detail/${props.shirtData._id}`
      );
      if (type === 3) {
        navigator.clipboard.writeText(
          `${window.location.origin}/detail/${props.shirtData._id}`
        );
        setShowToastInfo("Link copied!");
      }
      menu.value = false;
    };

    return { menu, toggle, shareButton };
  },
};
</script>

<style scoped>
.share-social {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
}
</style>
