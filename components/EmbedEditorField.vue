<script setup>
const model = defineModel();
const props = defineProps(
  {
    id:Number
  }
)
</script>
<template>
  <v-expansion-panel :title="'Field' + id">
    <v-expansion-panel-text class="bg-background">
      <v-text-field label="Image URL" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background mb-6" v-model="model.image.url"></v-text-field>
      <v-text-field label="Thumbnail URL" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background mb-6" v-model="model.thumbnail.url"></v-text-field>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
