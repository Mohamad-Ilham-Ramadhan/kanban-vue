<script setup>
import { ref, Teleport, Transition, defineProps, defineEmits, onUpdated, toRef } from 'vue'
import { useField } from 'vee-validate'

const paperRef = ref(null)
const selectButtonRef = ref(null)
const props = defineProps(['open', 'items', 'name', 'renderValueProp', 'realValueProp'])
const emit = defineEmits(['open-select', 'close-select', 'select-value'])

onUpdated(() => {
  console.log('Select open has changed')
  if (paperRef.value !== null) {
    // @ts-ignore
    const { top, bottom, left, right, width, height } =
      selectButtonRef.value.getBoundingClientRect()
    console.log('top', top, 'bottom', bottom, 'height', height + top)
    setTimeout(() => {
      // @ts-ignore
      const { bottom: paperBottom, height: paperHeight } = paperRef.value.getBoundingClientRect()
      console.log('paperBottom', paperBottom)
      paperRef.value.style.left = `${left}px`
      paperRef.value.style.width = `${width}px`

      if (paperHeight <= window.innerHeight) {
        if (paperRef.value !== null && paperBottom + bottom < window.innerHeight) {
          // @ts-ignore
          paperRef.value.style.top = `${bottom + 10}px`
          // @ts-ignore
          console.log('paperBottom', paperBottom)
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
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta
} = useField(name, undefined, {
  initialValue: props.items[0]
})
</script>

<template>
  <div class="relative">
    <button
      ref="selectButtonRef"
      class="block w-full text-left border-2 border-slate-400 dark:border-gray-600 focus:border-primary dark:focus:border-primary rounded text-sm py-2 px-4"
      @click="$emit('open-select')"
      type="button"
    >
      {{ inputValue[props.renderValueProp] }}
    </button>
    <input class="invisible" aria-hidden="true" :value="inputValue" :name="name" />
  </div>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="props.open" class="fixed z-[1000] inset-0">
        <div class="absolute z-[101] inset-0" @click="$emit('close-select')"></div>
        <div
          ref="paperRef"
          class="absolute z-[1000] rounded overflow-hidden bg-dark"
          id="paper"
          v-if="props.open"
        >
          <div
            v-for="(item, index) in props.items"
            @click="
              () => {
                handleChange(item)
                emit('select-value')
                emit('close-select')
              }
            "
            class="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white hover:cursor-pointer"
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
