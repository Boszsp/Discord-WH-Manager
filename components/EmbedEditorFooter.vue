<script setup>
const model = defineModel();
</script>
<template>
  <v-expansion-panel title="Footer">
    <v-expansion-panel-text class="bg-background">
      <v-textarea rows="1" :label="'Footer (' + model?.footer?.text?.length + '/2048)'" maxlength="2048" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background mb-6" v-model="model.footer.text"></v-textarea>
      <v-row>
        <v-col cols="6">
          <v-text-field type="datetime-local" label="Timestamp" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background" v-model="model.footer.timestamp"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field type="url" label="Icon URL" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background" v-model="model.footer.icon_url"></v-text-field>
        </v-col>
      </v-row>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
