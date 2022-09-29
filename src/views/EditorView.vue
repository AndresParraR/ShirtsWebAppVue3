<template>
  <div class="container-base">
    <DialogFullScreen
      @handleDialog="handleDialogStep($event)"
      :dialog="dialogSteps"
      :pastSteps="steps"
      :isBuy="isBuy"
    />
    <div class="mb-10">
      <v-btn-toggle v-model="toggle" color="primary">
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="fa-solid fa-cash-register"
          @click="handleDialogStep(true); isBuy = false"
        >
          Sell
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          append-icon="fa-solid fa-bag-shopping"
          @click="handleDialogStep(true); isBuy = true"
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
        </v-card>
      </div>
      <div>
        <Moveable />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeMount } from "vue";

// Components
import Moveable from "../components/Moveable.vue";
import DialogFullScreen from "../components/DialogFullScreen.vue";
import { useState, useActions } from "@/utils/helpesVuex";

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
    const { user } = useState(["user"]);
    const { addMoveableElement } = useActions(["addMoveableElement"]);

    const form = ref(null);
    const isBuy = ref(false);
    const addText = ref(null);
    const page = ref(1);
    const text = ref("");
    const toggle = ref(null);
    const tab = ref(null);
    const dialogSteps = ref(false);
    const steps = ref<stepProp[]>([
      {
        component: "Register",
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
    const newSteps = ref<stepProp[]>([]);

    const textRules = ref([(v: any) => !!v || "Text is required"]);
    const imageRules = ref([(v: any) => !!v || "Image is required"]);

    const validForm = ref(true);
    const objImage = ref([]);
    const urlImg = ref<string | null>(null);

    watch(user, (value) => {
      console.log("user", value);
      if (value) {
        newSteps.value = steps.value.filter(
          (el) => el.component != "Register" && el.component != "Login"
        );
      }
      if (!dialogSteps.value) steps.value = newSteps.value;
    });

    watch(objImage, (value) => {
      console.log("objImage", value);
    });

    onBeforeMount(() => {
      console.log("onBeforeMount", user);
      if (user.value) {
        newSteps.value = steps.value.filter(
          (el) => el.component != "Register" && el.component != "Login"
        );
        steps.value = newSteps.value;
        console.log(steps.value);
      }
    });

    const handleDialogStep = (val: boolean) => {
      console.log("handleDialogStep", val);
      if (!val && newSteps.value.length > 0) {
        steps.value = newSteps.value;
      }
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
            };
            break;

          case "img":
            element = {
              txt: null,
              src: val,
              isImage: true,
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

    return {
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
    };
  },
});
</script>