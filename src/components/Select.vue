<script setup>
import { ref, Teleport, Transition, watch, defineProps } from 'vue'
// const selectOpen = ref(false)
const paperRef = ref(null)
const selectButtonRef = ref(null)
const props = defineProps(['open', 'items'])
// const open = ref(props.open)
console.log('selectOpen', props.open)
watch(() => props.open, () => {
   console.log('Select open has changed', paperRef)
   if (selectButtonRef.value !== null) {
      // @ts-ignore
      const { top, bottom, height } = selectButtonRef.value.getBoundingClientRect()
      console.log('top', top, 'bottom', bottom, 'height', height + top)
      setTimeout(() => {
         // @ts-ignore
         const { bottom: paperBottom, height: paperHeight } = paperRef.value.getBoundingClientRect()
         console.log('paperBottom', paperBottom)
         if (paperHeight <= window.innerHeight) {
            if (paperRef.value !== null && (paperBottom + bottom) < window.innerHeight) {
               // @ts-ignore
               paperRef.value.style.top = `${bottom}px`
               // @ts-ignore
               console.log('paperBottom', paperBottom)
            } else if (paperRef.value !== null && (paperBottom + bottom) > window.innerHeight) {
               // @ts-ignore 
               paperRef.value.style.top = `${(window.innerHeight - paperHeight) - 20}px`
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
         paperRef.value.style.visibility = 'visible'
      })
   }
})
</script>

<template>
   <button ref="selectButtonRef" class="border rounded-lg py-2 px-4" @click="$emit('open-select')">Select</button>
   <Teleport to="body">
      <Transition name="overlay">
         <div v-if="props.open" class="fixed inset-0">
            <div class="absolute z-[100] inset-0" @click="$emit('close-select')"></div>
            <div ref="paperRef" class="absolute z-[1000] w-[100px] border rounded-lg bg-red-200"
               :style="{ visibility: 'hidden' }">
               <div v-for="item in props.items" class="p-2 bg-slate-100">{{ item }}</div>
            </div>
         </div>
      </Transition>
   </Teleport>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
   transition: opacity .2s ease-out, transform .2s ease-out;
}

.overlay-enter-from,
.overlay-leave-to {
   opacity: 0;
}
</style>