<script setup>
const model = defineModel();
const props = defineProps({
  id: Number,
});
const emit = defineEmits(["delete", "clone", "move:up", "move:down"]);
</script>
<template>
  <v-expansion-panel :title="'Field' + (id + 1)" class="bg-background">
    <v-expansion-panel-text class="bg-background">
      <div class="flex w-full items-center gap-2">
        <v-text-field :label="'Name (' + model.name.length + '/256)'" maxlength="256" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background mb-6" v-model="model.name"></v-text-field>
        <v-checkbox density color="primary" label="Inline" v-model="model.inline"></v-checkbox>
      </div>
      <v-textarea rows="3" :label="'Value (' + model.value.length + '/1024)'" color="primary" density="compact" variant="outlined" hide-details maxlength="4096" class="bg-component-background mb-6" v-model="model.value"></v-textarea>
    </v-expansion-panel-text>
    <div class="p-2 px-6 border-b">
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
</template>
