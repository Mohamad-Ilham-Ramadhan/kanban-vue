<script setup>
   import { Teleport } from 'vue';

   const props = defineProps(['open', 'editText', 'deleteText','top', 'right', 'left', 'bottom']);
   console.log('open', props.open)
   console.log('editText', props.editText)
   console.log('deleteText', props.deleteText)
</script>

<template>
  <div
    v-show="props.open"
    :class="['absolute z-[1000] w-[196px] px-6 py-4 rounded-lg font-semibold bg-dark drop-shadow-md', props.top ? props.top : 'top-[130%]', props.left, props.right, props.bottom]"
  >
    <div
      class="hover:cursor-pointer hover:opacity-60 text-slate-400 mb-3 transition-opacity"
      @click="$emit('editOnClick')"
    >
      {{ props.editText }}
    </div>
    <div
      class="hover:cursor-pointer hover:opacity-60 text-red-450 transition-opacity"
      @click="$emit('deleteOnClick')"
    >
      {{ props.deleteText }}
    </div>
  </div>
  <Teleport to="body">
     <div v-show="props.open" @click="$emit('overlayOnClick')" class="dropdown-overlay fixed z-[100] inset-0"></div>
  </Teleport>
</template>

<style>
</style>
