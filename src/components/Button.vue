<script setup>
   import clsx from 'clsx'
   import {defineProps} from 'vue'
   const props = defineProps(['class', 'backgroundColor', 'color', 'text'])

   let bg = 'bg-primary hover:bg-primary-light'
   if (props.backgroundColor) bg = props.bg

   let color = 'text-white'
   if (props.color) color = props.color
</script>
<template>
   <button :class="clsx('py-3 px-5 rounded-full text-[15px] font-bold transition-colors', props.class, bg, color)">
      {{ props.text }}
   </button>
</template>

<style>
   
</style>