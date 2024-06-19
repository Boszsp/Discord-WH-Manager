<script setup>
const emit = defineEmits(["refresh"]);
const props = defineProps({title: String, method: String, initBody: String, url: String, disabled: Boolean});
const isLoading = ref(false);
const murl = ref(props?.url);
const body = ref(props.initBody ?? "{\n\n}");
const isError = ref(false);
const method = ref(props?.method?.toUpperCase() ?? "GET");

const responseM = ref("");
function fetching() {
  isLoading.value = true;
  isError.value = false;
  if (method?.value?.toUpperCase() == "POST" || method?.value?.toUpperCase() == "PATCH" || method?.value?.toUpperCase() == "DELETE") {
    $fetch(murl.value, {
      method: method?.value?.toLowerCase(),
      body: JSON.parse(body.value),
    })
      .then((r) => {
        responseM.value = r;
        console.log(r);
      })
      .catch((r) => {
        isError.value = true;
        responseM.value = r;
        console.error(r);
      })
      .finally(() => (isLoading.value = false));
  } else {
    $fetch(murl.value, {
      method: method?.value?.toLowerCase(),
    })
      .then((r) => {
        responseM.value = r;
        console.log(r);
      })
      .catch((r) => {
        isError.value = true;
        responseM.value = r;
        console.error(r);
      })
      .finally(() => (isLoading.value = false));
  }
}
</script>
<template>
  <v-card class="rounded-lg bg-component-background" :elevation="2" border rounded :loading="isLoading">
    <div :class="'px-4 pt-2 pb-8 flex flex-col lg:flex-row gap-4 border-l-4 ' + (method?.toUpperCase() == 'DELETE' ? 'border-danger' : method?.toUpperCase() == 'POST' || method?.toUpperCase() == 'PATCH' ? 'border-warning' : 'border-success')">
      <span class="flex flex-col gap-4 lg:w-1/2">
        <h4 class="text-h6 font-bold">{{ title ?? "Fetch Test" }}</h4>
        <div class="flex gap-4 items-center">
          <v-text-field label="URL" color="primary" :disabled="props.disabled" density="compact" variant="outlined" v-model="murl" hide-details class="bg-component-background"></v-text-field>
          <v-btn variant="flat" prepend-icon="mdi-email-fast" @click="fetching">Fetch</v-btn>
        </div>
        <v-select v-if="!props?.method" v-model="method" label="Method" :items="['GET', 'POST', 'PATCH', 'DELETE']" variant="outlined" density="compact" hide-details></v-select>
        <v-textarea auto-grow rows="3" label="body" v-model="body" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background"></v-textarea>
      </span>
      <span class="lg:hidden">
        <v-divider></v-divider>
      </span>
      <span class="lg:w-1/2">
        <h4 class="text-h6 font-bold mb-4">Response</h4>
        <div class="flex gap-4">
          <span>
            <v-chip :color="isError ? 'danger' : responseM ? 'success' : 'warning'">{{ method?.toUpperCase() ?? "GET" }} Status</v-chip>
          </span>
          <span class="w-full h-full">
            <v-sheet class="w-full h-full p-2" rounded>
              {{ JSON.stringify(responseM, undefined, 4) }}
            </v-sheet>
          </span>
        </div>
      </span>
    </div>
  </v-card>
</template>
