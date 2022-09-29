<template>
  <div class="container">
    <div
      ref="container"
      style="
        margin-left: 100px;
        width: 1000px;
        height: 700px;
        background: red;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-end;
      "
    >
      <div style="background: yellow; height: 500px; width: 500px"></div>
      <div
        v-for="(el, index) in moveableElementsComputed.value"
        :key="index"
        @click="setTarget(el.class)"
        :class="`${el.class} movetarget`"
        :ref="el.class"
        style="height: 24px; top: 0; left: 0; position: absolute"
        v-html="el.html"
      ></div>
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
    <Moveable
      className="moveable"
      v-bind:target="['.' + currentTargetElement + '']"
      v-bind:draggable="true"
      v-bind:scalable="true"
      @drag="onDrag"
      @scale="onScale"
      @rotate="onRotate"
      @dragStart="onDragStart"
    />
  </div>
</template>
<script>
import Moveable from "vue3-moveable";
import { useActions, useState } from "@/utils/helpesVuex";
import { toRef } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";

export default {
  name: "app",
  components: {
    Moveable,
  },
  setup() {
    const { setCurrentTargetElement } = useActions(["setCurrentTargetElement"]);
    const { currentTargetElement, moveableElements } = useState([
      "currentTargetElement",
      "moveableElements",
    ]);

    const moveableElementsComputed = computed(() => moveableElements);

    return {
      setCurrentTargetElement,
      currentTargetElement,
      moveableElementsComputed,
    };
  },
  watch: {
    moveableElementsComputed() {
      console.log("moveableElementsComputed", this.moveableElementsComputed);
    },
  },
  methods: {
    setTarget(ref) {
      console.log("setTarget", ref);
      this.setCurrentTargetElement(ref);
    },
    mouseOutContainer(props) {
      console.log("mouseOutContainer", props);
    },
    mouseOverContainer(props) {
      console.log("mouseOverContainer", props);
    },
    mouseLeaveContainer(props) {
      console.log(
        "mouseLeaveContainer",
        props,
        this.$refs.container.getBoundingClientRect()
      );
    },
    onDragStart(props) {
      console.log("dragStart", props, props.target.getBoundingClientRect());
      console.log(
        this.$refs[this.currentTargetElement][0].getBoundingClientRect()
      );
    },
    onDrag({ transform, top, left }) {
      // console.log(this.$refs[this.currentTargetElement][0]);
      let x = left;
      let y = top;
      let targetWidth =
        this.$refs[this.currentTargetElement][0].getBoundingClientRect().width;
      let targetHeight =
        this.$refs[this.currentTargetElement][0].getBoundingClientRect().height;

      let target =
        this.$refs[this.currentTargetElement][0].getBoundingClientRect();
      let container = this.$refs.container.getBoundingClientRect();

      // if (target.left <= container.left + 1) {
      //   return;
      // }
      // if (target.right >= container.right + 1) {
      //   return;
      // }

      if (y < 0) {
        this.$refs[this.currentTargetElement][0].style.top = "0px";
      } else if (y <= 700 - targetHeight) {
        this.$refs[this.currentTargetElement][0].style.top = y + "px";
      } else if (y > 700 - targetHeight) {
        this.$refs[this.currentTargetElement][0].style.top =
          700 - targetHeight + "px";
      }

      if (x < 0) {
        this.$refs[this.currentTargetElement][0].style.left = "2px";
      } else if (x <= 1000 - targetWidth - 1) {
        this.$refs[this.currentTargetElement][0].style.left = x + "px";
      } else if (x > 1000 - targetWidth - 1) {
        this.$refs[this.currentTargetElement][0].style.left =
          1000 - targetWidth - 1 + "px";
      }
      // this.$refs.target.style.transform = transform;
    },
    onScale(props) {
      // console.log(props);

      if (props.scale[0] < 0 || props.scale[1] < 0) {
        return;
      }

      let x = this.$refs[this.currentTargetElement][0].style.left.replace(
        "px",
        ""
      );
      let y = this.$refs[this.currentTargetElement][0].style.top.replace(
        "px",
        ""
      );
      let targetWidth =
        this.$refs[this.currentTargetElement][0].getBoundingClientRect().width;
      let targetHeight =
        this.$refs[this.currentTargetElement][0].getBoundingClientRect().height;

      let target =
        this.$refs[this.currentTargetElement][0].getBoundingClientRect();
      let container = this.$refs.container.getBoundingClientRect();

      // console.log(
      //   // x,
      //   // 1000 - props.scale[0] * props.offsetWidth,
      //   this.$refs[this.currentTargetElement][0].getBoundingClientRect(),
      //   this.$refs[this.currentTargetElement][0].style
      // );

      if (this.$refs[this.currentTargetElement][0].style.transform) {
        // console.log(this.$refs[this.currentTargetElement][0].style.transform);
        let scaleX = this.$refs[
          this.currentTargetElement
        ][0].style.transform.substring(
          this.$refs[this.currentTargetElement][0].style.transform.indexOf(
            "("
          ) + 1,
          this.$refs[this.currentTargetElement][0].style.transform.indexOf(",")
        );
        // console.log(props.scale[0], scaleX);
        if (Math.abs(props.scale[0]) < Math.abs(scaleX)) {
          this.$refs[this.currentTargetElement][0].style.transform =
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
      this.$refs[this.currentTargetElement][0].style.transform =
        props.drag.transform;
    },
    onRotate({ drag }) {
      this.$refs[this.currentTargetElement][0].style.transform = drag.transform;
    },
  },
};
</script>

<style>
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
