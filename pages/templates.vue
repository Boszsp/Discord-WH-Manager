<script setup>
let allTemplateId = ref([1, 2, 3, 4]);
let allTemplate = ref({i0: ""});

function renderAll() {
  allTemplateId.value = getAllTemplateId().sort();
  const hold_allTemplate = {};
  const hold_allTemplateRender = {};
  allTemplateId.value.forEach((v) => {
    hold_allTemplate["i" + v] = JSON.stringify(safeParse(getTemplateFromId(v)), undefined, 4);
  });
  allTemplate.value = hold_allTemplate;
}
onNuxtReady(() => {
  renderAll();
});
</script>

<template>
  <div class="m-6 flex flex-col gap-4">
    <h4 class="text-h6 mb-2 font-bold">All Templates</h4>
    <v-sheet v-for="id of allTemplateId" class="rounded-lg bg-component-background" :elevation="2" border rounded>
      <div class="p-4 flex flex-col gap-4">
        <h6 class="text-h6">Template {{ id + 1 }}</h6>
        <div class="w-full grid lg:grid-cols-2">
          <div class="pb-6">
            <DryPreview :model="safeParse(allTemplate['i' + id] ?? '{}')"></DryPreview>
          </div>
          <div>
            <v-textarea rows="5" label="" auto-grow variant="outlined" bg-color="background-tertiary" flat v-model="allTemplate['i' + id]"></v-textarea>
            <div class="flex justify-end gap-4">
              <v-btn
                @click="
                  (_) => {
                    saveTemplate(id, allTemplate['i' + id]);
                    renderAll();
                  }
                "
                max-width="50%"
                elevation="0"
                prepend-icon="mdi-content-save"
              >
                Save
              </v-btn>
              <v-btn @click="(_) => navigateTo('/form?id=' + id)" max-width="50%" elevation="0" class="bg-background-secondary" prepend-icon="mdi-monitor-share">Use</v-btn>
              <v-btn
                v-show="id != 0"
                @click="
                  () => {
                    deleteTemplate(id);
                    renderAll();
                  }
                "
                max-width="50%"
                elevation="0"
                variant="tonal"
                color="danger"
                prepend-icon="mdi-delete"
              >
                Delete
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-sheet>

    <v-btn
      class="mt-6"
      @click="
        (_) => {
          saveTemplate(Math.max(...allTemplateId) + 1, getTemplateFromId(-1));
          renderAll();
        }
      "
      max-width="100%"
      elevation="1"
      prepend-icon="mdi-plus-box"
    >
      Add Template
    </v-btn>
  </div>
</template>
