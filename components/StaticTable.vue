<script setup>
const emit = defineEmits(["refresh"]);
const props = defineProps({title: String, headers: Object, data: Object, isLoading: Boolean});
const search = ref("");
</script>

<template>
  <v-sheet class="rounded-lg bg-component-background" border :elevation="2" rounded>
    <div class="flex justify-between items-center px-4 py-2 overflow-x-auto">
      <h4 class="text-h6 font-bold whitespace-nowrap mr-4">{{ title ?? "Static Table" }}</h4>
      <span class="flex gap-4 items-center">
        <span class="w-52">
          <v-text-field v-model="search" label="Search" color="primary" class="bg-background-tertiary" prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" size="small" hide-details></v-text-field>
        </span>
        <v-btn
          variant="flat"
          @click="
            () => {
              emit('refresh');
            }
          "
          color="primary"
          prepend-icon="mdi-refresh"
        >
          Refresh
        </v-btn>
      </span>
    </div>
    <v-divider></v-divider>
    <v-data-table :headers="headers" class="bg-component-background" :items="data" :search="search" :loading="isLoading"></v-data-table>
  </v-sheet>
</template>
