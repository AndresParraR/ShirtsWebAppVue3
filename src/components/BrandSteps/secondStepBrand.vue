<script lang="ts" setup>
import { ref, defineEmits, defineProps, defineExpose } from "vue";
import Moveable from "@/components/Moveable.vue";
import { ProductTypeEnum } from "../../types";
import { useActions } from "@/utils/helpesVuex";
import html2canvas from "html2canvas";
import { uploadFileDesign } from "@/firebase";

const props = defineProps({
  finishedFunc: {
    type: Function,
    required: false,
  },
});

const { addMoveableElement, saveBrand } = useActions([
  "addMoveableElement",
  "saveBrand",
]);

const emit = defineEmits<{
  (e: "done"): void;
}>();

const textRules = ref([(v: any) => !!v || "Text is required"]);
const imageRules = ref([(v: any) => !!v || "Image is required"]);

const form = ref(null);
const validForm = ref(true);
const objImage = ref([]);
const urlImg = ref<string | null>(null);
const tab = ref(null);
const text = ref("");

const createBrand = async () => {
  const container = document.getElementById("container-label");
  const canvas = await html2canvas(container as HTMLElement);
  let imageBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  const url = await uploadFileDesign(imageBlob as Blob);
  saveBrand({ url });
  emit("done");
  // var imageData = canvas.toDataURL("image/jpg");
  // var newData = imageData.replace(
  //   /^data:image\/jpg/,
  //   "data:application/octet-stream"
  // );
  // const download = document.createElement("a");
  // console.log(
  //   "imageData: ",
  //   imageData,
  //   "newData: ",
  //   newData,
  //   "download: ",
  //   download
  // );
  // download.setAttribute("download", "image.jpg");
  // download.setAttribute("href", newData);
  // download.click();
};

const addElement = (val: any, type: string) => {
  if (validForm.value) {
    var element = {};
    switch (type) {
      case "txt":
        element = {
          txt: val,
          src: null,
          isImage: false,
          key: ProductTypeEnum.LABEL,
        };
        break;

      case "img":
        element = {
          txt: null,
          src: val,
          isImage: true,
          key: ProductTypeEnum.LABEL,
        };
        break;
    }
    addMoveableElement(element);
    resetInputs();
  }
};

const selectFile = (val: any) => {
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

defineExpose({ submit: createBrand });
</script>

<template>
  <div style="padding: 0 8rem">
    <div style="display: grid; grid-template-columns: 1fr 1fr">
      <div>
        <v-btn
          class="my-5"
          variant="outlined"
          color="primary"
          append-icon="fa-solid fa-floppy-disk"
          @click="createBrand"
        >
          Create
        </v-btn>
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
        <Moveable :productType="ProductTypeEnum.LABEL" />
      </div>
    </div>
  </div>
</template>
