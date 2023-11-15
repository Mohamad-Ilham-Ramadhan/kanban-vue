<script setup>
import { ref, Teleport, Transition, watch } from 'vue'
import Logo from '@/components/Logo.vue'
import Button from './components/Button.vue';
import IconEllipsis from '@/components/icons/IconEllipsis.vue'
import IconBoard from '@/components/icons/IconBoard.vue'
// store
import { useBoardStore } from '@/stores/board.js'
const boardStore = useBoardStore()
const boards = boardStore.boards
const board = boardStore.boards[boardStore.activeBoard]
console.log('board', board)

  function toggleTheme() {
    document.documentElement.classList.toggle('dark')
  }

</script>

<template>
  <header class="flex flex-row items-center w-full h-[96px] fixed left-0 top-0 z-50 bg-white dark:bg-dark-light border-b border-b-slate-700">
    <div class="shrink-0 w-[300px] h-full flex items-center border-r border-r-slate-700 pl-8">
      <!-- <img src="@/assets/logo.svg" alt="logo"> -->
      <Logo />
    </div>
    <div class="flex flex-row w-full justify-between items-center px-8">
      <div class="font-bold text-2xl">{{ board.name }}</div>
      <div class="flex items-center">
        <Button text="+ Add New Task" class="mr-4" />
        <button class="block p-2.5 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-dark transition-colors">
          <IconEllipsis />
        </button>
      </div>
    </div>
  </header>
  <div class="flex flex-row">
    <aside class="shrink-0 w-[300px] h-[100vh] fixed left-0 top-0 z-40 dark:bg-dark-light bg-white border-r border-r-slate-700 pt-[96px]">
      <div class="h-full pt-4 beautify-scrollbar overflow-auto">
        <div class="uppercase text-[.7rem] text-slate-500 dark:text-slate-400 font-bold tracking-[.175rem] pl-8 mb-4">
          all boards ({{ boardStore.boards.length }})
        </div>
        <nav class="flex flex-col justify-between pr-6 mb-2">
          <li v-for="b in boards" class="list-none font-bold flex items-center dark:text-slate-400 text-slate-500 hover:bg-primary hover:text-white hover:cursor-pointer pl-8 py-3 rounded-r-full mb-1">
            <IconBoard class="mr-4" />
            <div>{{ b.name }}</div>
          </li>
        </nav>
        <Button @click="toggleTheme()" text="Toggle theme" />
  
      </div>
    </aside>
    <main class="pl-[300px] pt-[96px] pb-[40px] flex w-full h-[100vh] overflow-hidden">
      <div class="beautify-scrollbar w-[100vw] h-[calc(100vh-96px)] overflow-auto">
        <div class="flex w-full h-full">
        <!-- ... -->
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
