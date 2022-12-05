<script lang="ts" setup>
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeMount,
  computed,
  Ref,
} from "vue";

// Components
import Moveable from "@/components/Moveable.vue";
import DialogFullScreen from "@/components/DialogFullScreen.vue";

import firstStepBrand from "@/components/BrandSteps/firstStepBrand.vue";
import secondStepBrand from "@/components/BrandSteps/secondStepBrand.vue";
import Register from "@/components/Register.vue";
import Login from "@/components/Login.vue";
import SellOrBuyPrice from "@/components/SellOrBuyPrice.vue";

import { useState, useActions } from "@/utils/helpesVuex";
import { ProductTypeEnum } from "@/types";
import { validate } from "uuid";
import html2canvas from "html2canvas";
import { uploadFileDesign, uploadFileEditor } from "@/firebase";

import { StepsEnum } from "@/types";

import * as blobUtil from "blob-util";
import { useRoute, useRouter } from "vue-router";

interface stepProp {
  component: string;
  tutorial: boolean;
}

const { user, colours, moveableElements } = useState([
  "user",
  "colours",
  "moveableElements",
]);

const {
  addMoveableElement,
  fetchAllColours,
  createProduct,
  handleGenericLoading,
  buyProduct,
  fetchShirtsConfig,
  cleanMoveableElements,
} = useActions([
  "addMoveableElement",
  "fetchAllColours",
  "createProduct",
  "handleGenericLoading",
  "buyProduct",
  "fetchShirtsConfig",
  "cleanMoveableElements",
]);

const router = useRouter();
const route = useRoute();

const form = ref(null);
const stepper = ref(null);
const isRegister = ref(true);
const isBuy = ref(false);
const currentStep: any = ref(null);
const addText = ref(null);
const tempImg: Ref<string> = ref("");
const page = ref(1);
const text = ref("");
const toggle = ref(null);
const tab = ref(null);
const dialogSteps = ref(false);
const picker = ref("");
const swatches = ref([
  ["#FF0000", "#AA0000", "#550000"],
  ["#FFFF00", "#AAAA00", "#555500"],
  ["#00FF00", "#00AA00", "#005500"],
  ["#00FFFF", "#00AAAA", "#005555"],
  ["#0000FF", "#0000AA", "#000055"],
]);

const steps: any = ref([
  { step: StepsEnum.LOGINREGISTER, tutorial: false, completed: false },
  { step: StepsEnum.FIRSTSTEPBRAND, tutorial: true, completed: false },
  { step: StepsEnum.SECONDSTEPBRAND, tutorial: false, completed: false },
  { step: StepsEnum.BUYSELL, tutorial: false, completed: false },
]);

const textRules = ref([(v: any) => !!v || "Text is required"]);
const imageRules = ref([(v: any) => !!v || "Image is required"]);

const validForm = ref(true);
const edit = ref(false);
const objImage = ref([]);
const urlImg = ref<string | null>(null);

const coloursToPicker = computed(() => {
  let column = 0;
  let row = 0;
  return colours.value.reduce(
    (acc: any, el: any) => {
      acc[row][column] = el.name.toLowerCase();
      column += 1;
      if (column >= 3) {
        row += 1;
        column = 0;
        return [...acc, []];
      }
      return [...acc];
    },
    [[]]
  );
});

watch(coloursToPicker, (value) => {
  if (route.params.colour) {
    picker.value = getColour(route.params.colour as string);
  } else {
    picker.value = value[0][0];
  }
});

watch(user, (value) => {
  console.log("user", value, steps);
  validateDialogSteps();
  // handleDialogStep(false);
  // handleDialogStep(true);
});

watch(objImage, (value) => {
  console.log("objImage", value);
});

onBeforeMount(async () => {
  console.log("onBeforeMount", user, route.params);
  if (coloursToPicker.value.length > 0 && !route.params.colour) {
    picker.value = coloursToPicker.value[0][0];
  } else if (route.params.colour) {
    picker.value = getColour(route.params.colour as string);
  }
  validateDialogSteps();
  handleGenericLoading(true);
  await fetchAllColours();
  if (route.params.edit) {
    edit.value = true;
    await fetchShirtsConfig(route.params.id);
  } else {
    edit.value = false;
    cleanMoveableElements();
  }
  handleGenericLoading(false);
});

const updateStep = (value: any) => {
  if (steps.value[currentStep.value].tutorial) validateDialogSteps();
  if (value >= steps.value.length) handleDialogStep(false);

  if (value < currentStep.value && !steps.value[currentStep.value - 1].tutorial)
    return;

  if (
    !steps.value[currentStep.value].completed &&
    !steps.value[currentStep.value].tutorial &&
    value > currentStep.value
  )
    return;

  currentStep.value = value;
};

const currentStepCompleted = (event: any) => {
  const index = steps.value.findIndex((el: any) => el.step == event);
  steps.value[index].completed = true;
  console.log(steps.value);
  updateStep(index + 1);
  console.log("currentStepCompleted: ", event);
};

const setIsRegister = (val: boolean) => {
  isRegister.value = val;
};

const validateDialogSteps = () => {
  if (user.value) {
    steps.value = steps.value.map((el: any) => {
      switch (el.step) {
        case StepsEnum.LOGINREGISTER:
          el.completed = true;
          break;
        default:
          el.completed = false;
          break;
      }
      return el;
    });
    if (user.value.brandId) {
      steps.value = steps.value.map((el: any) => {
        switch (el.step) {
          case StepsEnum.LOGINREGISTER:
          case StepsEnum.FIRSTSTEPBRAND:
          case StepsEnum.SECONDSTEPBRAND:
            el.completed = true;
            break;
          default:
            el.completed = false;
            break;
        }
        return el;
      });
    }
  } else {
    steps.value = steps.value.map((el: any) => {
      el.completed = false;
      return el;
    });
  }
  currentStep.value = steps.value.findIndex((el: any) => el.completed == false);
};

const handleDialogStep = (val: boolean) => {
  validateDialogSteps();
  const container = document.getElementById("moveable-container");
  html2canvas(container as HTMLElement).then(async (canvas) => {
    const imageData = canvas.toDataURL("image/jpg");
    const newData = imageData.replace(
      /^data:image\/jpg/,
      "data:application/octet-stream"
    );
    tempImg.value = newData;
  });
  dialogSteps.value = val;
};

const addElement = (val: any, type: string) => {
  console.log(validForm.value);
  if (validForm.value) {
    var element = {};
    switch (type) {
      case "txt":
        element = {
          txt: val,
          src: null,
          isImage: false,
          key: ProductTypeEnum.SHIRT,
        };
        break;

      case "img":
        element = {
          txt: null,
          src: URL.createObjectURL(val),
          image: val,
          isImage: true,
          key: ProductTypeEnum.SHIRT,
        };
        break;
    }
    addMoveableElement(element);
    resetInputs();
  }
};

const selectFile = (val: any) => {
  console.log(val);
  // const toBase64 = (file) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     // this.$store
  //     //   .dispatch("POST_HEADQUARTER_PICTURE", {
  //     //     headquarterId: this.Headquarter.id,
  //     //     fileName: this.image.name,
  //     //     base64File: reader.result.split(",")[1],
  //     //   })
  //     //   .then((res) => {
  //     //     this.urlImg = res && URL.createObjectURL(this.image);
  //     //   });
  //   };
  //   reader.onerror = (error) => console.log("error ", error);
  // };
  if (objImage.value[0]) {
    urlImg.value = objImage.value[0];
  }
  // toBase64(objImage);
};

const resetInputs = () => {
  (form.value as any).reset();
  objImage.value = [];
};

const uploadImageShirt = async () => {
  const container = document.getElementById("moveable-container");
  const canvas = await html2canvas(container as HTMLElement);
  let imageBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  const design = await uploadFileDesign(imageBlob as Blob);
  return design;
};

// const uploadImageEdit = async () => {
//   let imageBlob = await new Promise((resolve) =>
//     canvas.toBlob(resolve, "image/png")
//   );
//   const design = await uploadFile(imageBlob as Blob);
//   return design;
// };

const getColour = (id: string) => {
  const colour = colours.value.find((el: any) => {
    if (el._id.toLowerCase() == id.toLowerCase()) {
      return el.name;
    }
  });

  return colour ? colour.name : "";
};

const submit = async ({ price, sizeId, quantity, address }: any) => {
  const colourId = colours.value.find((el: any) => {
    if (el.name.toLowerCase() == picker.value.toLowerCase()) {
      return el._id;
    }
  });
  try {
    handleGenericLoading(true);
    const design = await uploadImageShirt();
    let config = [];
    if (
      moveableElements.value[ProductTypeEnum.SHIRT] &&
      moveableElements.value[ProductTypeEnum.SHIRT].length > 0
    ) {
      console.log(moveableElements.value[ProductTypeEnum.SHIRT]);
      config = await Promise.all(
        moveableElements.value[ProductTypeEnum.SHIRT].map(async (el: any) => {
          let url = "";
          if (el.isImage) {
            const imageBlob = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = function (e: any) {
                console.log(e.target.result);
                let arrayBuffer = e.target.result;
                let blob = blobUtil.arrayBufferToBlob(
                  arrayBuffer,
                  el.image.type
                );
                resolve(blob);
              };
              reader.onerror = (error) => {
                reject(error);
              };
              reader.readAsArrayBuffer(el.image);
            });
            url = await uploadFileEditor(imageBlob as Blob);
            console.log(imageBlob);
          }
          return {
            cssProps: el.style,
            type: el.isImage ? "image" : "text",
            name: el.isImage ? url : el.txt,
          };
        })
      );
      // const result = await Promise.all(config);
    }
    const createdProduct = await createProduct({
      design,
      userPrice: price ? parseInt(price) : 0,
      colourId: colourId._id,
      config,
    });
    if (isBuy.value) {
      await buyProduct({
        userId: createdProduct.userId,
        productId: createdProduct._id,
        sizeId,
        quantity: parseInt(quantity),
        address,
      });
    }
  } finally {
    handleGenericLoading(false);
  }
  handleDialogStep(false);
  console.log("Finished");
};
</script>

<template>
  <div class="container-base">
    <DialogFullScreen
      ref="stepper"
      @handleDialog="handleDialogStep($event)"
      @setData="submit($event)"
      @updateStep="updateStep($event)"
      :current-step="currentStep"
      :dialog="dialogSteps"
      :pastSteps="steps"
      :isBuy="isBuy"
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
      <v-carousel-item>
        <v-sheet height="100%">
          <div class="d-flex fill-height justify-center align-center">
            <firstStepBrand
              @done="currentStepCompleted(StepsEnum.FIRSTSTEPBRAND)"
            />
          </div>
        </v-sheet>
      </v-carousel-item>
      <v-carousel-item>
        <v-sheet height="100%">
          <div class="d-flex fill-height justify-center align-center">
            <secondStepBrand
              @done="currentStepCompleted(StepsEnum.SECONDSTEPBRAND)"
            />
          </div>
        </v-sheet>
      </v-carousel-item>
      <v-carousel-item>
        <v-sheet height="100%">
          <div class="d-flex fill-height justify-center align-center">
            <SellOrBuyPrice
              @dataReturned="submit($event)"
              :tempImg="tempImg"
              :isBuy="isBuy"
            />
          </div>
        </v-sheet>
      </v-carousel-item>
    </DialogFullScreen>
    <div class="mb-10">
      <v-btn-toggle v-model="toggle" color="primary">
        <v-btn
          v-if="!edit"
          variant="outlined"
          color="primary"
          prepend-icon="fa-solid fa-cash-register"
          @click="
            handleDialogStep(true);
            isBuy = false;
          "
        >
          Sell
        </v-btn>
        <v-btn
          v-if="!edit"
          variant="outlined"
          color="primary"
          append-icon="fa-solid fa-bag-shopping"
          @click="
            handleDialogStep(true);
            isBuy = true;
          "
        >
          Buy
        </v-btn>
      </v-btn-toggle>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr">
      <div>
        <v-card style="height: 100%">
          <v-tabs
            v-model="tab"
            fixed-tabs
            background-color="indigo-darken-2"
            theme="dark"
          >
            <v-tab value="one">Add Text</v-tab>
            <v-tab value="two">Add Image</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="one">
                <v-card>
                  <v-form
                    ref="form"
                    v-model="validForm"
                    lazy-validation
                    v-on:submit.prevent="addElement(text, 'txt')"
                  >
                    <v-text-field
                      v-model="text"
                      :rules="textRules"
                      ref="addText"
                      class="mt-5"
                      label="Text"
                      prepend-inner-icon="fa-solid fa-align-left"
                      variant="outlined"
                      required
                    ></v-text-field>
                    <v-btn
                      variant="outlined"
                      color="primary"
                      append-icon="fa-solid fa-circle-plus"
                      @click.prevent="addElement(text, 'txt')"
                    >
                      Add
                    </v-btn>
                  </v-form>
                </v-card>
              </v-window-item>

              <v-window-item value="two">
                <v-card>
                  <v-form
                    ref="formImg"
                    v-model="validForm"
                    lazy-validation
                    v-on:submit.prevent="addElement(text, 'txt')"
                  >
                    <v-file-input
                      class="mt-5"
                      :rules="imageRules"
                      v-model="objImage"
                      chips
                      accept="image/*"
                      prepend-icon=""
                      @change="selectFile($event)"
                      prepend-inner-icon="fa-solid fa-images"
                      variant="outlined"
                      label="Upload an image"
                    ></v-file-input>
                    <v-btn
                      variant="outlined"
                      color="primary"
                      append-icon="fa-solid fa-circle-plus"
                      @click.prevent="addElement(urlImg, 'img')"
                    >
                      Add
                    </v-btn>
                  </v-form>
                </v-card>
              </v-window-item>
            </v-window>
          </v-card-text>

          <p class="text-h5 text--primary ml-5 mt-16 mb-5">
            Choose the T-Shirt colour
          </p>
          <v-color-picker
            :hide-inputs="true"
            :hide-canvas="true"
            :hide-sliders="true"
            :show-swatches="true"
            :swatches="coloursToPicker"
            v-model="picker"
            elevation="0"
          ></v-color-picker>
        </v-card>
      </div>
      <div>
        <Moveable :color="picker" :productType="ProductTypeEnum.SHIRT" />
      </div>
    </div>
  </div>
</template>
