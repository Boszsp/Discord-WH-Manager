<script setup>
const props = defineProps({
  fields: Object,
});
const formatFileds = computed(() => {
  let hold = [],
    countRow = 0;
  props.fields.forEach((i, c) => {
    if (!i.inline || !props.fields[c - 1].inline) {
      if (hold[countRow]) countRow += 1;
      hold[countRow] = [i];
    } else if (i.inline) {
      if (!hold[countRow]) {
        hold[countRow] = [];
      }
      hold[countRow].push(i);
    }
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
