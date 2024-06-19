<script setup>
const props = defineProps({DBInfo: Object});
</script>
<template>
  <v-sheet rounded elevation="0" class="bg-success max-lg:mb-4">
    <div class="flex gap-2 rounded border px-4">
      <v-icon size="48">mdi-database</v-icon>
      <span class="break-keep whitespace-nowrap gap-4 mr-2">
        <table>
          <tr>
            <td class="font-bold">Adapter</td>
            <td class="px-1">:</td>
            <td class="pr-4">{{ props.DBInfo?.adapter }}</td>
            <td class="font-bold">Doc count</td>
            <td class="px-1">:</td>
            <td class="pr-4">{{ props.DBInfo?.doc_count }}</td>
          </tr>
          <tr>
            <td class="font-bold">Name</td>
            <td class="px-1">:</td>
            <td class="pr-2">{{ props.DBInfo?.db_name }}</td>
            <td class="font-bold">Update seq</td>
            <td class="px-1">:</td>
            <td class="pr-2">{{ props.DBInfo?.update_seq }}</td>
          </tr>
        </table>
      </span>
    </div>
  </v-sheet>
</template>
