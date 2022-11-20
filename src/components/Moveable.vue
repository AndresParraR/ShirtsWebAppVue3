<template>
  <div class="container">
    <div
      id="moveable-container"
      class="Tshirt"
      style="
        margin-left: 100px;
        width: 1000px;
        height: 700px;
        position: relative;
        display: flex;
        justify-content: center;
        background: #fff;
      "
    >
      <div
        v-if="productType == ProductTypeEnum.SHIRT"
        style="position: absolute; top: 0; bottom: 0; left: 0; right: 0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path
            :style="{ fill: color }"
            d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"
          />
        </svg>
      </div>

      <div
        id="container-label"
        v-else-if="productType == ProductTypeEnum.LABEL"
        ref="container"
        style="
          background: grey;
          height: 200px;
          width: 500px;
          border-radius: 0.5em;
          margin: 2em 0;
          position: relative;
        "
      >
        <div
          v-for="(el, index) in moveableElementsComputed.value[productType]"
          :key="index"
          @click="(e) => setTarget(e, el)"
          :class="`${el.class} movetarget`"
          :ref="el.class"
          :style="el.style"
          v-html="el.html"
        ></div>
      </div>

      <!-- <v-icon>fa-solid fa-shirt</v-icon> -->
      <div
        v-if="productType == ProductTypeEnum.SHIRT"
        ref="container"
        style="height: 570px; width: 500px; position: relative; bottom: -140px"
      >
        <div
          v-for="(el, index) in moveableElementsComputed.value[productType]"
          :key="index"
          @click="(e) => setTarget(e, el)"
          :class="`${el.class} movetarget`"
          :ref="el.class"
          :style="el.style"
          v-html="el.html"
        ></div>
      </div>
      <!-- {{ moveableElementsComputed }} -->
      <!-- <div
        @click="setTarget('target')"
        class="target movetarget"
        ref="target"
        style="height: 24px; top: 0; left: 0; position: absolute"
      >
        Vue Moveable
      </div>
      <div
        @click="setTarget('target2')"
        class="target2 movetarget"
        ref="target2"
        style="height: 24px; top: 30px; left: 0; position: absolute"
      >
        Vue Moveable 2
      </div> -->
    </div>

    <!-- <v-btn id="download-moveable" @click="getImage">test</v-btn> -->

    <Moveable
      className="moveable"
      v-bind:target="getCurrentTarget"
      v-bind:draggable="true"
      v-bind:scalable="true"
      @drag="onDrag"
      @scale="onScale"
      @rotate="onRotate"
      @dragStart="onDragStart"
      @dragEnd="onDragEnd"
      @scaleEnd="onScaleEnd"
    />
  </div>
</template>
<script>
import Moveable from "vue3-moveable";
import { useActions, useState } from "@/utils/helpesVuex";
import { toRef } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { ProductTypeEnum } from "../types";
import html2canvas from "html2canvas";
import { ref } from "vue";
import { uploadFile } from "@/firebase";

export default {
  name: "app",
  components: {
    Moveable,
  },
  props: {
    color: {
      type: String,
      required: false,
      default: "#FFF",
    },
    productType: {
      type: Number,
      required: true,
    },
  },
  created() {
    // console.log("ProductTypeEnum", ProductTypeEnum.LABEL);
    window.addEventListener("click", (event) => {
      const isMove = event.target.parentElement.classList
        .toString()
        .includes("movetarget")
        ? event.target.parentElement.classList.toString().includes("movetarget")
        : event.target.classList.toString().includes("movetarget");
      if (!this.currentTargetElement.class) {
        return;
      } else if (!isMove) {
        this.setCurrentTargetElement({});
        this.removeTargetActive();
      }
    });
  },
  setup() {
    const { setCurrentTargetElement, editStyleMoveableElement } = useActions([
      "setCurrentTargetElement",
      "editStyleMoveableElement",
    ]);
    const { currentTargetElement, moveableElements } = useState([
      "currentTargetElement",
      "moveableElements",
    ]);

    const moveableElementsComputed = computed(() => moveableElements);

    const t = ref(false);

    return {
      t,
      setCurrentTargetElement,
      currentTargetElement,
      moveableElementsComputed,
      ProductTypeEnum,
      editStyleMoveableElement,
    };
  },
  computed: {
    getCurrentTarget() {
      if (!this.currentTargetElement.class) {
        return [];
      } else {
        return [`.${this.currentTargetElement.class}`];
      }
    },
  },
  methods: {
    getImage() {
      const container = document.getElementById("moveable-container");
      html2canvas(container).then(async (canvas) => {
        console.log(canvas);
        let imageBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        console.log("imageBlob: ", imageBlob);
        uploadFile(imageBlob);
        var imageData = canvas.toDataURL("image/jpg");
        var newData = imageData.replace(
          /^data:image\/jpg/,
          "data:application/octet-stream"
        );
        const download = document.createElement("a");
        console.log(
          "imageData: ",
          imageData,
          "newData: ",
          newData,
          "download: ",
          download
        );
        download.setAttribute("download", "image.jpg");
        download.setAttribute("href", newData);
        download.click();
      });
    },
    removeTargetActive() {
      const target = document.getElementsByClassName("targetActive")[0];
      if (target) target.classList.toggle("targetActive");
    },
    setTarget(event, ref) {
      console.log(event, ref, this.currentTargetElement);
      const isActive = event.target.classList
        .toString()
        .includes("targetActive");
      if (!isActive) {
        this.removeTargetActive();

        event.target.classList.toggle("targetActive");
        this.setCurrentTargetElement(ref);
      } else if (this.currentTargetElement == null) {
        this.setCurrentTargetElement(ref);
      }
    },
    onDragStart(props) {
      console.log("dragStart", props, props.target.getBoundingClientRect());
      console.log(this.currentTargetElement);
      console.log(
        this.$refs[this.currentTargetElement.class][0].getBoundingClientRect()
      );
    },
    onDrag({ transform, top, left }) {
      // console.log(this.$refs[this.currentTargetElement][0]);
      let x = left;
      let y = top;
      let targetWidth =
        this.$refs[this.currentTargetElement.class][0].getBoundingClientRect()
          .width;
      let targetHeight =
        this.$refs[this.currentTargetElement.class][0].getBoundingClientRect()
          .height;

      let target =
        this.$refs[this.currentTargetElement.class][0].getBoundingClientRect();
      let container = this.$refs.container.getBoundingClientRect();

      const height = container.height;
      const width = container.width;

      // if (target.left <= container.left + 1) {
      //   return;
      // }
      // if (target.right >= container.right + 1) {
      //   return;
      // }

      if (y < 0) {
        this.$refs[this.currentTargetElement.class][0].style.top = "0px";
      } else if (y <= height - targetHeight) {
        this.$refs[this.currentTargetElement.class][0].style.top = y + "px";
      } else if (y > height - targetHeight) {
        this.$refs[this.currentTargetElement.class][0].style.top =
          height - targetHeight + "px";
      }

      if (x < 0) {
        this.$refs[this.currentTargetElement.class][0].style.left = "2px";
      } else if (x <= width - targetWidth - 1) {
        this.$refs[this.currentTargetElement.class][0].style.left = x + "px";
      } else if (x > width - targetWidth - 1) {
        this.$refs[this.currentTargetElement.class][0].style.left =
          width - targetWidth - 1 + "px";
      }
      // this.$refs.target.style.transform = transform;
    },
    onDragEnd(props) {
      this.editStyleMoveableElement({
        ...this.currentTargetElement,
        key: this.productType,
        style: props.target.style.cssText,
      });
    },
    onScale(props) {
      // console.log(props);

      if (props.scale[0] < 0 || props.scale[1] < 0) {
        return;
      }

      let x = this.$refs[this.currentTargetElement.class][0].style.left.replace(
        "px",
        ""
      );
      let y = this.$refs[this.currentTargetElement.class][0].style.top.replace(
        "px",
        ""
      );
      let targetWidth =
        this.$refs[this.currentTargetElement.class][0].getBoundingClientRect()
          .width;
      let targetHeight =
        this.$refs[this.currentTargetElement.class][0].getBoundingClientRect()
          .height;

      let target =
        this.$refs[this.currentTargetElement.class][0].getBoundingClientRect();
      let container = this.$refs.container.getBoundingClientRect();

      // console.log(
      //   // x,
      //   // 1000 - props.scale[0] * props.offsetWidth,
      //   this.$refs[this.currentTargetElement][0].getBoundingClientRect(),
      //   this.$refs[this.currentTargetElement][0].style
      // );

      if (this.$refs[this.currentTargetElement.class][0].style.transform) {
        // console.log(this.$refs[this.currentTargetElement][0].style.transform);
        let scaleX = this.$refs[
          this.currentTargetElement.class
        ][0].style.transform.substring(
          this.$refs[
            this.currentTargetElement.class
          ][0].style.transform.indexOf("(") + 1,
          this.$refs[
            this.currentTargetElement.class
          ][0].style.transform.indexOf(",")
        );
        // console.log(props.scale[0], scaleX);
        if (Math.abs(props.scale[0]) < Math.abs(scaleX)) {
          this.$refs[this.currentTargetElement.class][0].style.transform =
            props.drag.transform;
        }
      }

      if (target.left <= container.left + 1) {
        return;
      }
      if (target.right >= container.right + 1) {
        return;
      }

      // if (y < 0) {
      //   return;
      // } else if (y > 700 - targetHeight) {
      //   return;
      // }

      // if (x < 0) {
      //   this.$refs.target.style.left = "2px";
      // } else if (x <= 1000 - targetWidth - 1) {
      //   this.$refs.target.style.left = x + "px";
      // } else if (x > 1000 - targetWidth - 1) {
      //   this.$refs.target.style.left = 1000 - targetWidth - 1 + "px";
      // }
      this.$refs[this.currentTargetElement.class][0].style.transform =
        props.drag.transform;
    },
    onScaleEnd(props) {
      this.editStyleMoveableElement({
        ...this.currentTargetElement,
        key: this.productType,
        style: props.target.style.cssText,
      });
    },
    onRotate({ drag }) {
      this.$refs[this.currentTargetElement.class][0].style.transform =
        drag.transform;
    },
  },
};
</script>

<style>
.Tshirt {
  /* background: url("../assets/t-shirt.svg"); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: #000;
}
.movetarget {
  cursor: pointer;
  min-width: 20px;
  text-align: center;
}
.moveable-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  cursor: default;
}
</style>
