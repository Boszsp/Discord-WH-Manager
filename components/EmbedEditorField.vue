<script setup>
const model = defineModel();
const props = defineProps({
  id: Number,
});
</script>
<template>
  <v-expansion-panel :title="'Field' + (id + 1)">
    <v-expansion-panel-text class="bg-background">
      <div class="flex w-full items-center gap-2">
        <v-text-field :label="'Name (' + model.name.length + '/256)'" maxlength="256" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background mb-6" v-model="model.name"></v-text-field>
        <v-checkbox density color="primary" label="Inline" v-model="model.inline"></v-checkbox>
      </div>
      <v-textarea rows="3" :label="'Value (' + model.value.length + '/1024)'" color="primary" density="compact" variant="outlined" hide-details maxlength="4096" class="bg-component-background mb-6" v-model="model.value"></v-textarea>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
