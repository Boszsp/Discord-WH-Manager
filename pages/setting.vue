<script setup>
import CryptoJS from "crypto-js";
const DBInfo = ref(await getDBInfo());
const resultValue = ref("");
async function refresh() {
  DBInfo.value = await getDBInfo();
}
</script>
<template>
  <div class="w-full flex justify-center px-2">
    <v-card rounded elevation="2" class="lg:w-10/12 w-full bg-component-background">
      <div class="p-4 flex flex-col gap-2">
        <div class="flex flex-col-reverse lg:flex-row lg:items-center">
          <span class="w-full">
            <h4 class="text-h6 font-bold hidden lg:block">Export & Import Data</h4>
            <div class="flex gap-4">
              <v-btn
                @click="
                  () => {
                    resultValue = JSON.stringify(
                      getHooks().data.value?.hooks.map((r) => {
                        delete r?.id;
                        return r;
                      })
                    );
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
            </div>
          </span>
          <v-sheet rounded border class="bg-background max-lg:mb-4">
            <div class="flex gap-2 rounded border px-4">
              <v-icon size="48">mdi-database</v-icon>
              <span class="break-keep whitespace-nowrap flex gap-4 mr-2">
                <span>
                  <p>Adapter : {{ DBInfo.adapter }}</p>
                  <p>Name : {{ DBInfo.db_name }}</p>
                </span>
                <span>
                  <p>Doc count : {{ DBInfo.doc_count }}</p>
                  <p>Adapter : {{ DBInfo.adapter }}</p>
                </span>
              </span>
            </div>
          </v-sheet>
          <h4 class="text-h6 font-bold lg:hidden">Export & Import Data</h4>
        </div>
        <v-textarea v-model="resultValue" rows="20" hide-details class="bg-background-tertiary mt-8" variant="outlined"></v-textarea>
      </div>
    </v-card>
  </div>
</template>
