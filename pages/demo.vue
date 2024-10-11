<script setup>
const str = ref("xxx")
</script>

<template>
    <div class="flex w-full justify-center pt-4">
    <ClientOnly>
        <div class="w-2/3">
        <CkeditorComp v-model="str"/>
    </div>
    </ClientOnly>
</div>
</template>
