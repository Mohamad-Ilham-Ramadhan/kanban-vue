<script setup>
   const props = defineProps(['open', 'editText', 'deleteText','top', 'right', 'left', 'bottom']);
   defineEmits(['onClickEdit', 'onClickDelete', 'onClickOverlay'])
</script>

<template>
  <div
    v-show="props.open"
    :class="['absolute z-[1000] w-[196px] px-6 py-4 rounded-lg font-semibold bg-white dark:bg-dark shadow-md shadow-slate-200 dark:shadow-zinc-900', props.top ? props.top : 'top-[130%]', props.left, props.right, props.bottom]"
  >
    <div
      class="hover:cursor-pointer hover:opacity-60 text-slate-400 mb-3 transition-opacity"
      @click="$emit('onClickEdit')"
    >
      {{ props.editText }}
    </div>
    <div
      class="hover:cursor-pointer hover:opacity-60 text-red-450 transition-opacity"
      @click="$emit('onClickDelete')"
    >
      {{ props.deleteText }}
    </div>
  </div>
   <div v-show="props.open" @click="$emit('onClickOverlay')" class="dropdown-overlay fixed z-[100] inset-0"></div>
</template>

<style>
</style>
