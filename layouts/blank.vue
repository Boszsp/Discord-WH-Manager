<script setup>
const {data: authData} = await useFetch("/api/session");
const isAuth = useAuth();
isAuth.value = authData != null && authData.id;
</script>

<template>
  <v-main>
    <slot />
  </v-main>
</template>
