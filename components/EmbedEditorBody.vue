<script setup>
const model = defineModel();
</script>
<template>

    <v-expansion-panel title="Body">
      <v-expansion-panel-text class="bg-background">
        <v-text-field :label="'Title (' + model.title.length + '/256)'" maxlength="256" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background mb-6" v-model="model.title"></v-text-field>
        <v-textarea :label="'Description (' + model.description.length + '/4096)'" color="primary" density="compact" variant="outlined" hide-details maxlength="4096" class="bg-component-background mb-6" v-model="model.description"></v-textarea>
        <div class="flex gap-2">
          <v-text-field type="url" label="URL" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background w-10/12" v-model="model.url"></v-text-field>
          <v-text-field type="color" label="Color" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background" v-model="model.color"></v-text-field>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
</template>
