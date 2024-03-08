<script setup >
import { ref, defineProps, defineEmits } from 'vue'
const emit = defineEmits(['close-modal'])
const props = defineProps(['open', 'class'])
const modalRef = ref(null)
</script>

<template>
  <Teleport to="body">
    <div>
      <!-- modal -->
      <Transition name="modal">
        <div v-if="props.open" ref="modalRef"
          :class="['p-8 dark:text-white text-black rounded-lg bg-white text-black dark:bg-dark-light fixed z-[1000] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2', props.class]">
          <slot></slot>
        </div>
      </Transition>
      <!-- overlay -->
      <Transition>
        <div v-if="props.open" @click="emit('close-modal')" class="bg-black opacity-60 fixed inset-0 z-[100]"></div>
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