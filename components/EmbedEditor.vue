<script setup>
const model = defineModel();
const emit = defineEmits(["delete", "clone", "cloneSync", "move:up", "move:down"]);
const props = defineProps({
  id: Number,
});
</script>
<template>
  <v-expansion-panels color="background">
    <v-expansion-panel :title="'Embed' + (props.id + 1)" class="border-l-4" :style="{borderColor: model.color}">
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
        >
          Clone
        </v-btn>
        <v-btn
          @click="
            () => {
              emit('cloneSync', model);
            }
          "
          size="small"
          class="mt-4 mr-2"
          variant="outlined"
          color="warning"
        >
          Sync Clone
        </v-btn>
        <v-btn
          @click="
            () => {
              emit('move:up', props.id, model);
            }
          "
          size="small"
          class="mt-4 mr-2 opacity-75"
          variant="outlined"
          color=""
        >
          UP
        </v-btn>
        <v-btn
          @click="
            () => {
              emit('move:down', props.id, model);
            }
          "
          size="small"
          class="mt-4 mr-2 opacity-75"
          variant="outlined"
          color=""
        >
          DOWN
        </v-btn>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
