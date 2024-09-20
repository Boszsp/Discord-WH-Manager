<script setup>
const props = defineProps({
  model: Object,
});

//const model = defineModel();
</script>

<template>
  <Preview :avatarURL="model?.avatar_url?.length > 6 ? model?.avatar_url : null" :username="model?.username" :content="model?.content">
    <div class="flex flex-col gap-2">
      <div class="w-fit" v-for="(embed, i) in model?.embeds">
        <Embed :data="embed" />
      </div>
    </div>
  </Preview>
</template>
