<script setup >
import { ref, defineProps, defineEmits } from 'vue';
import IconClose from './icons/IconClose.vue';
const emit = defineEmits(['close-modal'])
const props = defineProps(['open', 'class', 'isFullscreen'])
const modalRef = ref(null);


</script>

<template>
  <Teleport to="body">
    <div>
      <!-- modal -->
      <Transition name="modal">
        <div v-if="props.open" ref="modalRef"
          :class="['dark:text-white text-black rounded-lg bg-white text-black dark:bg-dark-light fixed z-[1000]', props.isFullscreen ? 'top-0 bottom-0 left-1/2 -translate-x-1/2' : 'top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2', props.class]">
          <button
            class="absolute top-1 right-1 z-50 p-2 rounded-md bg-zinc-800"
            @click="emit('close-modal')"
            v-show="isFullscreen"
          >
            <IconClose class="text-slate-400" />
          </button>
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