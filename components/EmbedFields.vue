<script setup>
const props = defineProps({
  fields: Object,
});
const formatFileds = computed(() => {
  let hold = [],
    countRow = 0;
  props.fields.forEach((field, index) => {
    if (!field.inline || !index || !props.fields[index - 1].inline) {
      countRow++;
    }
    hold[countRow] = hold[countRow] || [];
    hold[countRow].push(field);
  });
  return hold;
});
</script>

<template>
  <div v-for="render_fields in formatFileds" class="flex text-sm gap-4 mb-2">
    <div v-for="field in render_fields">
      <p class="font-bold text-wrap break-words">{{ field.name }}</p>
      <p class="text-wrap break-words">{{ field.value }}</p>
    </div>
  </div>
</template>
