<script setup>
const model = defineModel();
</script>
<template>
    <v-expansion-panel title="Author">
      <v-expansion-panel-text class="bg-background">
      
            <v-text-field :label="'Name (' + model?.author?.name?.length + '/256)'" maxlength="256" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background mb-6" v-model="model.author.name"></v-text-field>
            <div class="flex gap-2">
          <v-text-field type="url" label="URL" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background" v-model="model.author.url"></v-text-field>
          <v-text-field type="url" label="Icon URL" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background" v-model="model.author.icon_url"></v-text-field>
        </div>
    </v-expansion-panel-text>
    </v-expansion-panel>

    
</template>
