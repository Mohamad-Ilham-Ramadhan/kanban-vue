<script setup>
import { defineProps } from 'vue';


const props = defineProps({
   class: {
      type: String,
      default() {
         return ''
      }
   },
   backgroundColor: {
      type: String,
      default() {
         return  'bg-primary hover:bg-primary-light'
      }
   },
   color: {
      type: String,
      default() {
         return 'text-white'
      }
   },
   type: {
      type: String,
      default() {
         return null
      }
   },
   size: {
      type: String, // small, custom
      default() {
         return 'medium'
      }
   },
   disabled: {
      type: Boolean,
      default() {
         return false;
      }
   }
});

let padding = {
   medium: 'py-3 px-5',
   small: 'py-[.55rem] px-5',
};
let textSize = {
   medium: 'text-[15px]',
   small: 'text-[13px]',
}
// let sizeVar = 'medium'; // medium
// if (props.size === 'small') sizeVar = 'py-[.55rem] px-5 text-[13px]'

</script>
<template>
   <button
      :class="['rounded-full font-bold transition-colors focus:outline-2 focus:outline focus:outline-amber-300', size === 'custom' ? '' : padding[props.size], size === 'custom' ? '' : textSize[props.size], props.backgroundColor, props.color, props.class]"
      :type="props.type" :disabled="props.disabled">
      <slot></slot>
   </button>
</template>

<style></style>