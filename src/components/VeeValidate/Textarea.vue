<script setup>
import { toRef } from 'vue';
import { useField } from 'vee-validate'
const props = defineProps(['value', 'name', 'successMessage', 'placeholder', 'disabled', 'rows'])

const name = toRef(props, 'name')
const { value: inputValue, errorMessage, handleBlur, handleChange } = useField(name, undefined, {
   initialValue: props.value
})
</script>

<template>
   <div class="relative w-full">
      <textarea :name="name" :id="name" :value="inputValue" :placeholder="placeholder" @input="handleChange" :disabled="props.disabled" :rows="props.rows"
         @blur="handleBlur" :class="['transition-colors bg-transparent rounded border-2 text-sm dark:text-white text-black block px-4 py-2 w-full outline-none', errorMessage ? 'border-red-500' : 'border-slate-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary', props.disabled ? 'opacity-30' : '',]"/>

      <div class="absolute top-1/2 -translate-y-1/2 right-2 text-xs text-red-500 font-semibold" v-show="errorMessage">Required</div>  
   </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
textarea::-webkit-scrollbar-track {
  background: transparent;        
}

textarea::-webkit-scrollbar-thumb {
  background-color: theme('colors.zinc.700');    
  border-radius: 20px;       
}
</style>