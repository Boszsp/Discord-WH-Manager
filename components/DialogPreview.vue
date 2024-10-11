<script>
const model = defineModel();
const props = defineProps({
  src: String,
});
</script>
<template>
  <v-dialog class="w-5/6 h-5/6" v-model="model">
    <v-card title="File Preview">
      <v-card-text>
        {{ props.src }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close Dialog" @click="() => (model = false)"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
