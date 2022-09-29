<template>
  <div style="padding: 0 8rem">
    <h1 class="text-center mb-16">Step 2</h1>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate quidem
      eum dicta laboriosam aliquid illo, possimus iste veritatis atque maiores
      nulla esse! Porro facere ut aspernatur, itaque neque libero a vitae
      sapiente distinctio odio officia temporibus atque illum inventore
      recusandae, suscipit mollitia non? Obcaecati, dolores. Quaerat non ad
      quibusdam a, cum optio ullam maiores. Cupiditate architecto vero eveniet!
      Commodi, repudiandae ab aperiam laudantium culpa maiores aspernatur
      assumenda non? Nihil voluptates quasi doloribus voluptatum cupiditate
      magnam quos, minus distinctio velit deleniti qui rem facere magni dolore
      officiis error sapiente recusandae quis non iure laboriosam quibusdam!
      Reprehenderit omnis eveniet vitae iure cumque?
    </p>
    <div class="mt-16 d-flex fill-height justify-center align-center">
      <v-card class="mx-auto" max-width="400">
        <v-img
          class="align-end text-white"
          height="200"
          src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          cover
        >
          <v-card-title>Top 10 Australian beaches</v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4"> Number 10 </v-card-subtitle>

        <v-card-text>
          <div>Whitehaven Beach</div>

          <div>Whitsunday Island, Whitsunday Islands</div>
        </v-card-text>

        <v-card-actions>
          <v-btn color="orange"> Share </v-btn>

          <v-btn color="orange"> Explore </v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="mx-auto" max-width="400">
        <v-img
          class="align-end text-white"
          height="200"
          src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          cover
        >
          <v-card-title>Top 10 Australian beaches</v-card-title>
        </v-img>

        <v-card-subtitle class="pt-4"> Number 10 </v-card-subtitle>

        <v-card-text>
          <div>Whitehaven Beach</div>

          <div>Whitsunday Island, Whitsunday Islands</div>
        </v-card-text>

        <v-card-actions>
          <v-btn color="orange"> Share </v-btn>

          <v-btn color="orange"> Explore </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  name: "secondStepBrand",
  props: {
    msg: String,
  },
};
</script>
