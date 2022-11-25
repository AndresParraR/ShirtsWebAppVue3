<template>
  <div class="container-base">
    <DialogFullScreen
      @handleDialog="handleDialogStep($event)"
      @setUserPrice="submit($event)"
      :dialog="dialogSteps"
      :pastSteps="stepsToShow"
      :isBuy="isBuy"
    />
    <div class="mb-10">
      <v-btn-toggle v-model="toggle" color="primary">
        <v-btn
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
        <!-- <v-btn
          variant="outlined"
          color="primary"
          append-icon="fa-solid fa-bag-shopping"
          @click="
            handleDialogStep(true);
            isBuy = true;
          "
        >
          Buy
        </v-btn> -->
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

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onBeforeMount,
  computed,
} from "vue";

// Components
import Moveable from "../components/Moveable.vue";
import DialogFullScreen from "../components/DialogFullScreen.vue";
import { useState, useActions } from "@/utils/helpesVuex";
import { ProductTypeEnum } from "@/types";
import { validate } from "uuid";
import html2canvas from "html2canvas";
import { uploadFile } from "@/firebase";

interface stepProp {
  component: string;
  tutorial: boolean;
}

export default defineComponent({
  name: "EditorView",
  components: {
    Moveable,
    DialogFullScreen,
  },
  setup() {
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
    } = useActions([
      "addMoveableElement",
      "fetchAllColours",
      "createProduct",
      "handleGenericLoading",
    ]);

    const form = ref(null);
    const isBuy = ref(false);
    const addText = ref(null);
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
    const steps = ref<stepProp[]>([
      {
        component: "Login",
        tutorial: false,
      },
      {
        component: "firstStepBrand",
        tutorial: true,
      },
      {
        component: "secondStepBrand",
        tutorial: false,
      },
      {
        component: "SellOrBuyPrice",
        tutorial: false,
      },
    ]);
    const stepsToShow = ref<stepProp[]>([]);
    const newSteps = ref<stepProp[]>([]);

    const textRules = ref([(v: any) => !!v || "Text is required"]);
    const imageRules = ref([(v: any) => !!v || "Image is required"]);

    const validForm = ref(true);
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
      picker.value = value[0][0];
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
      console.log("onBeforeMount", user);
      if (coloursToPicker.value.length > 0) {
        picker.value = coloursToPicker.value[0][0];
      }
      handleGenericLoading(true);
      await fetchAllColours();
      handleGenericLoading(false);
      validateDialogSteps();
    });

    const validateDialogSteps = () => {
      if (user.value) {
        newSteps.value = steps.value.filter((el) => {
          switch (el.component) {
            case "firstStepBrand":
            case "secondStepBrand":
            case "SellOrBuyPrice":
              return el;
          }
        });
        if (user.value.brandId) {
          newSteps.value = newSteps.value.filter((el) => {
            switch (el.component) {
              case "SellOrBuyPrice":
                return el;
            }
          });
        }
      } else {
        newSteps.value = steps.value;
      }
      stepsToShow.value = newSteps.value;
    };

    const handleDialogStep = (val: boolean) => {
      validateDialogSteps();
      console.log(
        "handleDialogStep",
        val,
        steps.value,
        newSteps.value,
        val && newSteps.value.length > 0
      );
      // if (newSteps.value.length > 0) {
      //   steps.value = newSteps.value;
      // }
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
              src: val,
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
        urlImg.value = URL.createObjectURL(objImage.value[0]);
      }
      // toBase64(objImage);
    };

    const resetInputs = () => {
      (form.value as any).reset();
      objImage.value = [];
    };

    // const uploadImageShirt = async () => {

    // };

    const submit = async (price: any) => {
      console.log("submit", price);
      debugger;
      const colourId = colours.value.find((el: any) => {
        if (el.name.toLowerCase() == picker.value.toLowerCase()) {
          return el._id;
        }
      });
      const container = document.getElementById("moveable-container");
      const canvas = await html2canvas(container as HTMLElement);
      let imageBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const design = await uploadFile(imageBlob as Blob);
      let config = [];
      // const design = await uploadImageShirt();
      if (
        moveableElements.value[ProductTypeEnum.SHIRT] &&
        moveableElements.value[ProductTypeEnum.SHIRT].length > 0
      ) {
        config = moveableElements.value[ProductTypeEnum.SHIRT].map(
          (el: any) => {
            return {
              cssProps: el.style,
              type: el.isImage ? "image" : "text",
              name: el.isImage ? "image" : "text",
            };
          }
        );
      }
      await createProduct({
        design,
        userPrice: parseInt(price),
        colourId: colourId._id,
        config,
      });
      handleDialogStep(false);
      console.log("Finished");
    };

    return {
      submit,
      coloursToPicker,
      stepsToShow,
      page,
      steps,
      dialogSteps,
      handleDialogStep,
      tab,
      toggle,
      text,
      addElement,
      addText,
      textRules,
      imageRules,
      validForm,
      form,
      selectFile,
      objImage,
      urlImg,
      isBuy,
      picker,
      swatches,
      ProductTypeEnum,
    };
  },
});
</script>
