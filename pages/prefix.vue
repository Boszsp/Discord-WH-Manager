<script setup>
const config = useRuntimeConfig();
if (config.public.staticMode) {
  navigateTo("/");
}
const {data, refresh, pending} = await getPrefixs();
/*const headers = [
  {title: "CODE", key: "code"},
  {title: "PREFIX", key: "prefix"},
];*/
</script>

<template>
  <div class="m-6">
    <FetchTool title="Update Prefixs" url="/api/japrefix" disabled method="post" :initBody="JSON.stringify({data: [{code: '', prefix: ''}]}, undefined, 4)"></FetchTool>
    <div class="mt-8"></div>
    <FetchTool title="Delete Prefixs" url="/api/japrefix" disabled method="delete" :initBody="JSON.stringify({code: ''}, undefined, 4)"></FetchTool>
    <div class="mt-8"></div>
    <StaticTable @refresh="refresh" :isLoading="pending" :data="data.JaPrefixs" title="Prefixs"></StaticTable>
  </div>
</template>
