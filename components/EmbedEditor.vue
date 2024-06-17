<script setup>
const model = defineModel();
const emit = defineEmits(["delete", "clone", "cloneSync", "move:up", "move:down", "add:field", "delete:field", "clone:field", "move:up:field", "move:down:field"]);
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
                      emit('clone:field', model, field);
                    }
                  "
                  @delete="
                    () => {
                      emit('delete:field', i);
                    }
                  "
                  @move:up="
                    (id) => {
                      emit('move:up:field', id);
                    }
                  "
                  @move:down="
                    (id) => {
                      emit('move:down:field', id);
                    }
                  "
                  v-model="model.fields[i]"
                  :id="i"
                />
              </v-expansion-panels>
              <v-btn
                prepend-icon="mdi-plus-thick"
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
          <v-icon>mdi-delete</v-icon>
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
          <v-icon>mdi-content-copy</v-icon>
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
          <v-icon>mdi-sync</v-icon>
          <v-icon>mdi-content-copy</v-icon>
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
          <v-icon>mdi-arrow-up-bold</v-icon>
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
          <v-icon>mdi-arrow-down-bold</v-icon>
        </v-btn>
      </div>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
