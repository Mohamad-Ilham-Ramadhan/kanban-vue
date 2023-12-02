<script setup>
   import { ref, watch, defineProps, onUpdated } from 'vue'
   const props = defineProps(['open'])
   const paperRef = ref(null)
   
   watch(() => props.open, () => {
      console.log('change on open', open.value)
      console.log('paperRef', paperRef.value)
   }, {immediate: true})

   onUpdated(() => {
      console.log('updated', paperRef.value)
   })
</script>

<template>
   <button
      @click="$emit('toggleOpen')"
   >Button</button>
   <div v-if="props.open" ref="paperRef">
      <li>item 1</li>
      <li>item 2</li>
      <li>item 3</li>
   </div>
</template>

<style>
</style>