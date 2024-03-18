
<script setup>

import { defineProps } from 'vue';
import { useIsMobile } from '../composables/isMobile';


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
   text: {
      type: String,
      default() {
         return '';
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
         return ''
      }
   },
   size: {
      type: String,
      default() {
         return 'medium'
      }
   },
   disable: {
      type: Boolean,
      default() {
         return false;
      }
   }
});
console.log('buttons props', props)

const {isMobile} = useIsMobile();
console.log('button props', props.backgroundColor)
let padding = {
   medium: 'py-3 px-5',
   small: 'py-[.55rem] px-5',
   mobile: 'py-2 px-4',
};
let textSize = {
   medium: 'text-[15px]',
   small: 'text-[13px]',
   mobile: 'text-[13px]',
}
// let sizeVar = 'medium'; // medium
// if (props.size === 'small') sizeVar = 'py-[.55rem] px-5 text-[13px]'

</script>
<template>
   <button
      :class="['rounded-full font-bold transition-colors transition-opacity', padding[isMobile ?  'mobile' : props.size], textSize[isMobile ? 'mobile': props.size], props.backgroundColor, props.color, props.class, isMobile && 'py-0 px-3']"
      :type="props.type" :disabled="props.disabled">
      {{ !isMobile ? props.text : null }}
      <svg v-show="isMobile" width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path fill="#FFF" d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"></path>
      </svg>
   </button>
</template>

<style></style>