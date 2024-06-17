<script setup>
const props = defineProps(
    {
        fields:Object
    }
)
</script>

<template>
    <div class="grid grid-cols-3 gap-4">
    <div v-for="field,i in fields" :class="'text-sm mt-2 ' + (field?.inline ? 'col-span-1' : 'col-span-3')">
        <p class="font-bold text-wrap break-words">{{ field.name }}</p>
        <p class="text-wrap break-words">{{ field.value }}</p>
    </div>
</div>
</template>
