<script setup>
const config = useRuntimeConfig();

const resultValue = ref("");
const DBInfo = ref(await getDBInfo());
async function refresh() {
  DBInfo.value = await getDBInfo();
}
</script>
<template>
  <div class="w-full flex justify-center px-2 h-full">
    <v-card rounded elevation="0" class="lg:w-10/12 w-full h-full pt-2 bg-component-background">
      <div class="p-4 flex flex-col gap-2">
        <div class="flex flex-col-reverse lg:flex-row lg:items-center">
          <span class="w-full">
            <h4 class="text-h6 font-bold hidden lg:block">Export & Import Data</h4>
            <div class="flex flex-wrap gap-4 mt-2">
              <v-btn
                @click="
                  async () => {
                    await getHooks();
                    resultValue = JSON.stringify(await getHooks().data.value.hooks);
                  }
                "
                prepend-icon="mdi-database-export"
                variant="flat"
                size="small"
              >
                Export
              </v-btn>
              <v-btn
                @click="
                  () => {
                    createHooks(JSON.parse(resultValue));
                    setTimeout(refresh, 100);
                  }
                "
                prepend-icon="mdi-database-import"
                variant="flat"
                color="warning"
                size="small"
              >
                Import
              </v-btn>
              <v-btn
                v-if="config.public.staticMode"
                @click="
                  async () => {
                    await destroyDB();
                    await refresh();
                  }
                "
                prepend-icon="mdi-database-minus"
                variant="flat"
                color="danger"
                size="small"
              >
                Clean app
              </v-btn>
              <v-btn
                v-if="config.public.staticMode"
                @click="
                  async () => {
                    await compressDB();
                    await refresh();
                  }
                "
                prepend-icon="mdi-arrow-collapse-all"
                variant="tonal"
                color="danger"
                size="small"
              >
                Compress DB
              </v-btn>
            </div>
          </span>

          <DBInfoCard v-if="config.public.staticMode" :DBInfo="DBInfo" />

          <h4 class="text-h6 font-bold lg:hidden">Export & Import Data</h4>
        </div>
        <v-textarea v-model="resultValue" rows="20" color="primary" hide-details class="bg-background mt-8" variant="solo"></v-textarea>
      </div>
    </v-card>
  </div>
</template>
