<script setup>
import { toRef } from 'vue';
import { useField } from 'vee-validate'
const props = defineProps(['type', 'value', 'name', 'successMessage', 'placeholder', 'disabled', ])

const name = toRef(props, 'name')
const { value: inputValue, errorMessage, handleBlur, handleChange } = useField(name, undefined, {
   initialValue: props.value
})
</script>

<template>
   <div class="relative w-full">
      <input :name="name" :id="name" :type="type" :value="inputValue" :placeholder="placeholder" @input="handleChange" :disabled="props.disabled"
         @blur="handleBlur" :class="['transition-colors bg-transparent rounded border-2 text-sm dark:text-white text-black block px-4 py-2 w-full outline-none', errorMessage ? 'border-red-500' : 'border-slate-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary', props.disabled ? 'opacity-30' : '',]"/>

      <div class="absolute top-1/2 -translate-y-1/2 right-2 text-xs text-red-500 font-semibold" v-show="errorMessage">{{errorMessage}}</div>  
   </div>
</template>

<style scoped></style>