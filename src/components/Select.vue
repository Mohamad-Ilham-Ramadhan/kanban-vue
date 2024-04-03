<script setup>
import { ref, defineProps, defineEmits, onUpdated, toRef } from 'vue'
import IconArrow from '@/components/icons/IconArrowDown.vue'

const paperRef = ref(null)
const selectButtonRef = ref(null)
const props = defineProps(['open', 'items', 'name', 'renderValueProp', 'realValueProp', 'value', 'handleChange'])
const emit = defineEmits(['open-select', 'close-select', 'select-value'])

onUpdated(() => {
  if (paperRef.value !== null) {
    // @ts-ignore
    const {  bottom, left,  width} =
      selectButtonRef.value.getBoundingClientRect()
    setTimeout(() => {
      // @ts-ignore
      const { bottom: paperBottom, height: paperHeight } = paperRef.value.getBoundingClientRect()
      paperRef.value.style.left = `${left}px`
      paperRef.value.style.width = `${width}px`

      if (paperHeight <= window.innerHeight) {
        if (paperRef.value !== null && paperBottom + bottom < window.innerHeight) {
          // @ts-ignore
          paperRef.value.style.top = `${bottom + 10}px`
          // @ts-ignore
        } else if (paperRef.value !== null && paperBottom + bottom > window.innerHeight) {
          // @ts-ignore
          paperRef.value.style.top = `${window.innerHeight - paperHeight - 20}px`
        }
      } else {
        // @ts-ignore
        paperRef.value.style.height = `${window.innerHeight - 20}px`
        // @ts-ignore
        paperRef.value.style.top = '10px'
        // @ts-ignore
        paperRef.value.style.overflow = 'auto'
      }
      // @ts-ignore
      // paperRef.value.style.visibility = 'visible'
    })
  }
})

const name = toRef(props, 'name')

console.log('Select props.items', props.items);

</script>

<template>
  <div class="relative">
    <button
      ref="selectButtonRef"
      class="block relative w-full text-left border-2 border-slate-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary rounded text-sm py-2 px-4"
      @click="$emit('open-select')"
      type="button"
    >
      <div>{{ props.value[props.renderValueProp] }}</div>
      <IconArrow :class="['text-primary w-[18px] h-[18px] absolute right-[12px] top-[10px] transition-transform', props.open && 'rotate-180']"/>
    </button>
    <input class="invisible" aria-hidden="true" :value="value" :name="name" />
  </div>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="props.open" class="fixed z-[1000] inset-0">
        <div class="absolute z-[101] inset-0" @click="$emit('close-select')"></div>
        <div
          ref="paperRef"
          class="absolute z-[1000] rounded overflow-hidden bg-white dark:bg-dark drop-shadow-md"
          id="paper"
          v-if="props.open"
        >
          <div
            v-for="(item) in props.items"
            :key="item.name"
            @click="
              () => {
                handleChange(item)
                emit('select-value')
                emit('close-select')
              }
            "
            class="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-black dark:hover:text-white hover:cursor-pointer"
          >
            {{ item[props.renderValueProp] }}
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
