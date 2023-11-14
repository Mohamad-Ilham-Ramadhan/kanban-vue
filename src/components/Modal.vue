<script setup >
   import { ref, Teleport, Transition, defineProps, onMounted, onUpdated } from 'vue'
   const props = defineProps({open: false})
   const modalRef = ref(null)
   onUpdated(() => {
      console.log(props.open, modalRef.value)
   })
</script>

<template>
  <div>
    <!-- modal -->
    <Transition name="modal">
      <div v-if="props.open" ref="modalRef"
        class="p-8 text-white rounded-lg bg-slate-800 fixed z-[1000] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <slot></slot>
      </div>
    </Transition>
    <!-- overlay -->
    <Teleport to="body">
      <Transition>
        <div v-if="props.open" @click="$emit('close-modal')"  class="bg-transparent fixed inset-0 z-[100]"></div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* we will explain what these classes do next! */
.modal-enter-active,
.modal-leave-active {
  transition: opacity .2s ease-out;
}

.modal-enter-from,
.modal-leave-to {
   opacity: 0;
}</style>
