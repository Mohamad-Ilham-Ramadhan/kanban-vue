<script setup>
import { ref, Teleport, Transition, watch } from 'vue'
import { useBoardStore } from '@/stores/board';

const store = useBoardStore()
console.log('store', store)
</script>

<template>
   <button @click="store.increment()">Platform Launch</button>
   <div>Active board: {{ store.activeBoard }}</div>
</template>

<style scoped>

</style>
