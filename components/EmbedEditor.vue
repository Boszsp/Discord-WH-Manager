<script setup>
const model = defineModel();
const emit = defineEmits(["delete", "clone", "syncClone"]);
const props = defineProps({
  id: Number,
});
</script>
<template>
  <v-expansion-panels color="background">
    <v-expansion-panel :title="'Embed' + props.id" class="border-l-4" :style="{borderColor: model.color}">
      <v-expansion-panel-text class="bg-background">
        <v-expansion-panels variant="accordion" multiple color="background" class="border-l-4 border-background-secondary">
          <EmbedEditorAuthor v-model="model" />
          <EmbedEditorBody v-model="model" />
          <EmbedEditorImage v-model="model" />
          <EmbedEditorFooter v-model="model" />
        </v-expansion-panels>

        <v-btn
          @click="
            () => {
              emit('delete', props.id);
            }
          "
          size="small"
          class="mt-4 mr-2"
          variant="outlined"
          color="danger"
          var
        >
          Delete
        </v-btn>
        <v-btn
          @click="
            () => {
              emit('clone', model);
            }
          "
          size="small"
          class="mt-4 mr-2"
          variant="outlined"
          color="primary"
          var
        >
          Clone
        </v-btn>
        <v-btn
          @click="
            () => {
              emit('syncClone', model);
            }
          "
          size="small"
          class="mt-4 mr-2"
          variant="outlined"
          color="warning"
          var
        >
          Sync Clone
        </v-btn>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
