<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
      style="z-index: 3001"
    >
      <!-- <template v-slot:activator>
        <v-btn color="primary" dark @click="$emit('handleDialog', true)">
          Open Dialog
        </v-btn>
      </template> -->
      <v-card>
        <v-toolbar color="white">
          <!-- <v-toolbar-title>Settings</v-toolbar-title> -->
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close">
            <v-icon>mdi:mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div style="height: 100%">
          <v-carousel
            ref="carousel"
            :model-value="currentStep"
            height="100%"
            @update:modelValue="$emit('updateStep', $event)"
            hide-delimiters
            progress="primary"
          >
            <template v-slot:prev="{ props }">
              <div v-if="currentStep == 0"></div>
              <v-btn
                v-else
                @click="props.onClick"
                :icon="props.icon"
                :class="props.class"
                :aria-label="props.ariaLabel"
              ></v-btn>
            </template>
            <template v-slot:next="{ props }">
              <v-btn
                v-if="currentStep == steps.length - 1"
                @click="$emit('handleDialog', false)"
                :icon="'fa-regular fa-share-from-square'"
                :class="props.class"
                :aria-label="'Finish'"
              ></v-btn>
              <v-btn
                v-else
                @click="props.onClick"
                :icon="props.icon"
                :class="props.class"
                :aria-label="props.ariaLabel"
              ></v-btn>
            </template>
            <!-- <v-carousel-item v-for="(step, i) in steps" :key="i">
              <v-sheet height="100%">
                <div class="d-flex fill-height justify-center align-center">
                  <component
                    :is="step.component"
                    v-bind="currentProps(step.component, i)"
                  />
                </div>
              </v-sheet>
            </v-carousel-item> -->
            <slot></slot>
          </v-carousel>
        </div>
        <!-- <v-bottom-navigation v-model="value">
          <v-btn value="recent">
            <span>Back</span>
            <v-icon>fa-solid fa-chevron-left</v-icon>
          </v-btn>

          <v-spacer />

          <v-btn value="nearby">
            <span>Next</span>
            <v-icon>fa-solid fa-chevron-right</v-icon>
          </v-btn>
        </v-bottom-navigation> -->
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import firstStepBrand from "./BrandSteps/firstStepBrand.vue";
import secondStepBrand from "./BrandSteps/secondStepBrand.vue";
import Register from "./Register.vue";
import Login from "./Login.vue";
import SellOrBuyPrice from "./SellOrBuyPrice.vue";
import PersonalData from "./PersonalData.vue";
import html2canvas from "html2canvas";

export default {
  // eslint-disable-next-line vue/no-unused-components
  // components: {
  //   firstStepBrand,
  //   secondStepBrand,
  //   Register,
  //   Login,
  //   SellOrBuyPrice,
  //   PersonalData,
  // },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    pastSteps: {
      type: Array,
      required: true,
    },
    currentStep: {
      type: [Number, null],
      required: true,
    },
    isBuy: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  // mounted() {
  //   console.log(this.pastSteps);
  //   this.steps = this.pastSteps.map((el) => {
  //     return { ...el, completed: false };
  //   });
  // },
  data() {
    return {
      tempImg: null,
      isLoginUp: false,
      carousel: 0,
      priceStepIsBuy: false,
      steps: [
        {
          component: "Register",
          completed: false,
        },
        {
          component: "firstStepBrand",
          completed: false,
        },
        {
          component: "secondStepBrand",
          completed: false,
        },
        {
          component: "SellOrBuyPrice",
          completed: false,
        },
      ],
    };
  },
  watch: {
    // dialog() {
    //   console.log("dialogFull", this.pastSteps);
    //   if (!this.dialog) this.validateSteps();
    //   // if (this.dialog) {
    //   //   const container = document.getElementById("moveable-container");
    //   //   html2canvas(container).then(async (canvas) => {
    //   //     const imageData = canvas.toDataURL("image/jpg");
    //   //     const newData = imageData.replace(
    //   //       /^data:image\/jpg/,
    //   //       "data:application/octet-stream"
    //   //     );
    //   //     this.tempImg = newData;
    //   //   });
    //   // }
    // },
    pastSteps() {
      this.validateSteps();
    },
  },
  computed: {},
  methods: {
    validateSteps() {
      this.steps = this.pastSteps;
      // this.steps = this.pastSteps.map((el) => {
      //   return { ...el, completed: false };
      // });
      // this.carousel = 0;
      // this.priceStepIsBuy = this.isBuy;
    },
    updateCarousel(value) {
      console.log(this.carousel, value, this.steps.length);
      if (value >= this.steps.length) this.close();

      if (Math.abs(value - this.carousel) > 1) {
        return;
      } else if (value < this.carousel && this.steps[this.carousel].completed) {
        return;
      }

      if (this.steps[this.carousel].completed && value > this.carousel) {
        this.carousel = value;
      } else if (
        (this.steps[this.carousel].tutorial && value > this.carousel) ||
        (this.steps[value].tutorial && value == this.carousel - 1)
      ) {
        this.carousel = value;
      }
    },
    close() {
      console.log("handleDialog");
      this.$emit("handleDialog", false);
    },
    setIsLoginUp(value) {
      this.isLoginUp = value;
      console.log(value, !this.isLoginUp ? "Login" : "Register", this);
      this.steps[
        this.steps.findIndex((el) =>
          el.component == !this.isLoginUp ? "Login" : "Register"
        )
      ].component = this.isLoginUp ? "Login" : "Register";
    },
    currentStepCompleted() {
      this.steps[this.carousel].completed = true;
      console.log(this.steps);
      this.updateCarousel(this.carousel + 1);
    },
    emitData(data) {
      console.log("emitData", data);
      this.$emit("setData", data);
    },
    currentProps(currentComponent, indexComponent) {
      switch (currentComponent) {
        case "Register":
          return {
            linkLogin: this.setIsLoginUp,
            finishedFunc: this.currentStepCompleted,
          };
        case "Login":
          return {
            linkRegister: this.setIsLoginUp,
            finishedFunc: this.currentStepCompleted,
          };
        case "secondStepBrand":
          return {
            finishedFunc: this.currentStepCompleted,
          };
        case "SellOrBuyPrice":
          return {
            setData: this.emitData,
            tempImg: this.tempImg,
            isBuy: this.priceStepIsBuy,
          };

        default:
          return {};
      }
    },
  },
};
</script>
