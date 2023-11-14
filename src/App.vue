<script setup>
import { ref, Teleport, Transition, watch } from 'vue'
import { useBoardStore } from '@/stores/board';
import Logo from '@/assets/logo.svg'

const store = useBoardStore()
console.log('store', store)
</script>

<template>
  <header class="flex flex-row h-[96px] bg-white dark:bg-dark-light">
    <div class="shrink-0 w-[300px]"></div>
  </header>
</template>

<style scoped></style>
