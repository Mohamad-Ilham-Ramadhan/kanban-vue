<script setup >
import { ref, Teleport, Transition, defineProps, onUpdated } from 'vue'
const props = defineProps(['open', 'cssClass'])
const modalRef = ref(null)
onUpdated(() => {
  console.log(props.open, modalRef.value)
})
</script>

<template>
  <Teleport to="body">
    <div>
      <!-- modal -->
      <Transition name="modal">
        <div v-if="props.open" ref="modalRef"
          :class="['p-8 dark:text-white text-black rounded-lg bg-white text-black dark:bg-dark-light fixed z-[1000] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2', cssClass]">
          <slot></slot>
        </div>
      </Transition>
      <!-- overlay -->
      <Transition>
        <div v-if="props.open" @click="$emit('close-modal')" class="bg-dark opacity-50 fixed inset-0 z-[100]"></div>
      </Transition>
    </div>
  </Teleport>
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
}
</style>
