<script setup>
const model = defineModel();
const emit = defineEmits(["delete", "clone", "cloneSync", "move:up", "move:down", "add:field", "delete:field", "clone:filed", "move:up:field", "move:down:field"]);
const props = defineProps({
  id: Number,
});
</script>
<template>
  <v-expansion-panels color="background">
    <v-expansion-panel :title="'Embed' + (props.id + 1)" class="border-l-4 bg-background" :style="{borderColor: model.color}">
      <v-expansion-panel-text>
        <v-expansion-panels elevation="0" variant="accordion" multiple color="background">
          <EmbedEditorAuthor v-model="model" />
          <EmbedEditorBody v-model="model" />
          <EmbedEditorImage v-model="model" />
          <v-expansion-panel title="Fileds">
            <v-expansion-panel-text class="bg-background">
              <v-expansion-panels v-for="(_, i) in model.fields" elevation="0" color="background">
                <EmbedEditorField
                  @clone="
                    (field) => {
                      emit('clone:filed', field);
                    }
                  "
                  @delete="
                    () => {
                      emit('delete:field', i);
                    }
                  "
                  v-model="model.fields[i]"
                  :id="i"
                />
              </v-expansion-panels>
              <v-btn
                @click="
                  () => {
                    emit('add:field', model);
                  }
                "
                class="mt-6"
                size="small"
              >
                Add Field
              </v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <EmbedEditorFooter v-model="model" />
        </v-expansion-panels>
      </v-expansion-panel-text>
      <div class="px-6 pb-4">
        <v-btn
          @click="
            () => {
              emit('delete', props.id);
            }
          "
          size="small"
          class="mr-2"
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
          class="mr-2"
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
          class="mr-2"
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
          class="mr-2 opacity-75"
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
          class="mr-2 opacity-75"
          variant="outlined"
          color=""
        >
          DOWN
        </v-btn>
      </div>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
