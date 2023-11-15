<script setup>
import clsx from 'clsx'
import { defineProps } from 'vue'
const props = defineProps(['class', 'backgroundColor', 'color', 'text', 'type', 'size'])
console.log(props.text, props.backgroundColor, props.color)

let size = 'py-3 px-5 text-[15px]'; // medium
if (props.size === 'small') size = 'py-2.5 px-5 text-[13px]'

</script>
<template>
   <button
      :class="['rounded-full font-bold transition-colors', size, props.backgroundColor ? props.backgroundColor : 'bg-primary hover:bg-primary-light', props.color ? props.color : 'text-white', props.class]"
      :type="props.type">
      {{ props.text }}
   </button>
</template>

<style></style>