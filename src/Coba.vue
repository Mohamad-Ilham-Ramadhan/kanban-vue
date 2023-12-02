<script setup>
   import { ref, watch } from 'vue'
   import Kikuk from './components/Kikuk.vue'

   const open = ref(false)
</script>

<template>
   <Kikuk :open="open" @toggle-open="open = !open" />
</template>

<style>
</style>