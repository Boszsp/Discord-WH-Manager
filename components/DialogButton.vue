<script setup>
const props = defineProps({
  title: String,
  btn_titles: String,
  btn_icon: String,
  btn_color: String,
});
const model = defineModel();
</script>

<template>
  <v-dialog max-width="75%">
    <template v-slot:activator="{props: activatorProps}">
      <v-btn v-bind="activatorProps" class="w-full" :prepend-icon="btn_icon" :color="btn_color" :text="props.btn_titles || 'Open'" variant="flat"></v-btn>
    </template>

    <template v-slot:default="{isActive}">
      <v-card :title="props.title ?? 'Dialog'">
        <div class="p-5">
          <v-textarea :model-value="JSON.stringify(exportAsTemplate(safeParseJson(JSON.stringify(model))?.data))" variant="outlined"></v-textarea>
          <slot />
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="danger" text="Close" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
