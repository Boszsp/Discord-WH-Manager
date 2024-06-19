<script setup>
const headers = [
  {title: "ID", key: "id"},
  {title: "Name", key: "name"},
  {title: "Link", key: "link"},
  {title: "Action", key: "action"},
];
const {data, pending, refresh} = await getHooks("/api/hooks");
function wrapupData() {
  data.value.hooks.map((i) => {
    i.action = false;
    return i;
  });
}
wrapupData();
watch(pending, () => {
  wrapupData();
});

const search = ref("");
const name = ref("");
const link = ref("");
const pubKey = ref("xxxxxxxxxxxxxxx");

async function addHandler() {
  const data2 = await createHooks([{name: name.value, link: link.value}]);
  if (!data2) {
    return;
  }
  name.value = "";
  link.value = "";

  refresh();
}
</script>
<template>
  <div class="m-6">
    <h4 class="text-h6 mb-2 font-bold">Add New Hooks</h4>
    <div class="flex items-center gap-4">
      <v-text-field hide-details density="compact" color="primary" class="bg-component-background" label="Name" v-model="name" variant="outlined"></v-text-field>
      <v-text-field hide-details density="compact" color="primary" class="bg-component-background" label="Link" v-model="link" variant="outlined"></v-text-field>
      <v-btn prepend-icon="mdi-database-plus" elevation="0" @click="addHandler" color="primary">Add</v-btn>
    </div>
    <v-text-field hide-details disabled density="compact" color="primary" class="bg-component-background mt-4" label="Publickey" v-model="pubKey" variant="outlined"></v-text-field>
  </div>
  <v-sheet class="m-6 rounded-lg bg-component-background" :elevation="2" rounded>
    <div class="flex justify-between items-center px-4 py-2 overflow-x-auto">
      <h4 class="text-h6 font-bold whitespace-nowrap mr-4">My Hooks</h4>
      <span class="flex gap-4 items-center">
        <span class="w-52">
          <v-text-field v-model="search" label="Search" color="primary" class="bg-background-tertiary" prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" size="small" hide-details></v-text-field>
        </span>
        <v-btn prepend-icon="mdi-refresh" elevation="0" @click="refresh" color="primary">Refresh</v-btn>
      </span>
    </div>
    <v-divider></v-divider>
    <v-data-table :headers="headers" class="bg-component-background" :items="data.hooks" :search="search" :loading="pending">
      <template v-slot:item.name="{item}">
        <span v-if="!item.action">{{ item.name }}</span>
        <span v-else>
          <v-text-field hide-details density="compact" color="primary" class="bg-background-tertiary" min-width="160" label="" v-model="item.name" variant="outlined" single-line></v-text-field>
        </span>
      </template>
      <template v-slot:item.link="{item}">
        <span v-if="!item.action">{{ item.link }}</span>
        <span v-else>
          <v-text-field hide-details density="compact" color="primary" class="bg-background-tertiary" min-width="160" label="" v-model="item.link" variant="outlined" single-line></v-text-field>
        </span>
      </template>
      <template v-slot:item.action="{item}">
        <div class="flex gap-2">
          <v-btn
            @click="
              () => {
                item.action = true;
              }
            "
            v-if="!item.action"
            size="small"
            elevation="0"
            variant="outlined"
            color="warning"
            prepend-icon="mdi-square-edit-outline"
          >
            Edit
          </v-btn>
          <v-btn
            :loading="item.isSaving"
            @click="
              async () => {
                item.isSaving = true;
                await editHook(item.id, {name: item.name, link: item.link});
                item.action = false;
                item.isSaving = false;
              }
            "
            v-else
            size="small"
            elevation="0"
            color="success"
            variant="outlined"
            prepend-icon="mdi-content-save"
          >
            Save
          </v-btn>
          <v-btn
            size="small"
            variant="outlined"
            elevation="0"
            color="danger"
            @click="
              async () => {
                await deleteHook(item.id);
                refresh();
              }
            "
            prepend-icon="mdi-delete"
          >
            Delete
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-sheet>
</template>
