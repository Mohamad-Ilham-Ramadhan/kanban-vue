import {ref, onMounted, onUnmounted} from 'vue';

export function useIsMobile() {
   let isMobile = ref(window.innerWidth < 767 ? true : false);

   function size() {
      if (window.innerWidth < 767) {
         isMobile.value = true;
      } else {
         isMobile.value = false;
      }
      console.log('isMobile size()')
   }
   onMounted(() => {
      window.removeEventListener('resize', size)
      window.addEventListener('resize', size)
   });
   onUnmounted(() => {
      window.removeEventListener('resize', size)
   })

   return {isMobile}
}