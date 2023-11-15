<script setup>
import { toRef } from 'vue';
import { useField } from 'vee-validate'
const props = defineProps(['type', 'value', 'name', 'label', 'successMessage', 'placeholder'])

const name = toRef(props, 'name')
const { value, errorMessage, handleBlur, handleChange, meta } = useField(name, undefined, {
   initialValue: props.value
})
</script>

<template>
   <div class="">
      <label :for="name" class="font-semibold text-xs text-slate-400 dark:text-white block mb-2">{{ label }}</label>
      <div class="relative w-full">
         <input :name="name" :id="name" :type="type" :value="value" :placeholder="placeholder" @input="handleChange"
            @blur="handleBlur" :class="['transition-colors bg-transparent rounded-md border-2 text-sm dark:text-white text-black block px-6 py-2 w-full outline-none', errorMessage ? 'border-red-500' : 'border-slate-400 dark:border-gray-600 focus:border-primary dark:focus:border-primary']"/>
   
         <div class="absolute top-1/2 -translate-y-1/2 right-2 text-xs text-red-500 font-semibold" v-show="errorMessage">Required</div>  
      </div>
   </div>
</template>

<style scoped></style>