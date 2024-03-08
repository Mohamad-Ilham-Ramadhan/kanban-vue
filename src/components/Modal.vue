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
<!-- <div
            v-show="openOption"
            class="absolute z-[1000] right-0 top-[130%] w-[196px] px-6 py-4 rounded-lg font-semibold bg-dark drop-shadow-md"
          >
            <div
              class="hover:cursor-pointer hover:opacity-60 text-slate-400 mb-3 transition-opacity"
              @click="
                () => {
                  openModalEdit = true
                  openOption = false
                }
              "
            >
              Edit Board
            </div>
            <div
              class="hover:cursor-pointer hover:opacity-60 text-red-450 transition-opacity"
              @click="
                () => {
                  openModalDelete = true
                  openOption = false
                }
              "
            >
              Delete Board
            </div>
          </div> -->