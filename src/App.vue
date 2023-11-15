<script setup>
import { ref, Teleport, Transition, watch } from 'vue'
import Logo from '@/components/Logo.vue'
import Button from './components/Button.vue';
import IconEllipsis from '@/components/icons/IconEllipsis.vue'
import IconBoard from '@/components/icons/IconBoard.vue'
import IconMoonStar from '@/components/icons/IconMoonStar.vue'
import IconSun from '@/components/icons/IconSun.vue'
import IconHide from '@/components/icons/IconHide.vue'
import IconClose from '@/components/icons/IconClose.vue'
import Modal from '@/components/Modal.vue'
import Input from '@/components/Input.vue'
import { Form, FieldArray } from 'vee-validate'
import * as yup from 'yup'
// store
import { useBoardStore } from '@/stores/board.js'
const boardStore = useBoardStore()
const boards = boardStore.boards

const theme = ref('dark')
function toggleTheme() {
  document.documentElement.classList.toggle('dark')
  if (theme.value === 'dark') theme.value = 'light'
  else theme.value = 'dark'
}

const openCreateNewBoard = ref(true)

function onSubmit(values) {
  alert(JSON.stringify(values, null, 2));
}
function onInvalidSubmit() {
  alert('Invalid submit')
  // const submitBtn = document.querySelector('.submit-btn');
  // submitBtn.classList.add('invalid');
  // setTimeout(() => {
  //   submitBtn.classList.remove('invalid');
  // }, 1000);
}
</script>

<template>
  <header
    class="flex flex-row items-center w-full h-[96px] fixed left-0 top-0 z-50 bg-white dark:bg-dark-light border-b border-b-slate-200 dark:border-b-slate-700">
    <div class="shrink-0 w-[300px] h-full flex items-center border-r border-r-slate-200 dark:border-r-slate-700 pl-8">
      <!-- <img src="@/assets/logo.svg" alt="logo"> -->
      <Logo />
    </div>
    <div class="flex flex-row w-full justify-between items-center px-8">
      <div class="font-bold text-2xl">{{ boardStore.board.name }}</div>
      <div class="flex items-center">
        <Button text="+ Add New Task" class="mr-4" />
        <button class="block p-2.5 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-dark transition-colors">
          <IconEllipsis />
        </button>
      </div>
    </div>
  </header>

  <div class="flex flex-row">
    <aside
      class="shrink-0 w-[300px] h-[100vh] fixed left-0 top-0 z-40 dark:bg-dark-light bg-white border-r border-r-slate-200 dark:border-r-slate-700 pt-[96px]">
      <div class="flex flex-col justify-between h-full pt-4 beautify-scrollbar overflow-auto">
        <div class="shrink-0">
          <div class="uppercase text-[.7rem] text-slate-500 dark:text-slate-400 font-bold tracking-[.175rem] pl-8 mb-4">
            all boards ({{ boardStore.boards.length }})
          </div>
          <nav class="flex flex-col justify-between pr-6 mb-2">
            <li v-for="(b, index) in boards"
              :class="['list-none font-bold flex items-center hover:bg-primary-light hover:text-white dark:hover:text-white hover:cursor-pointer pl-8 py-2.5 rounded-r-full mb-1', boardStore.activeIndex === index ? 'bg-primary text-white' : 'dark:text-slate-400 text-slate-500']"
              @click="boardStore.setActiveIndex(index)">
              <IconBoard class="mr-4" />
              <div>{{ b.name }}</div>
            </li>

            <li
              class="flex items-center font-bold pl-8 py-2.5 list-none text-primary hover:opacity-60 hover:cursor-pointer transition-opacity"
              @click="openCreateNewBoard = true">
              <span class="mr-4">
                <IconBoard />
              </span>
              <span>+ Create New Board</span>
            </li>
            <Modal :open="openCreateNewBoard" @close-modal="openCreateNewBoard = false" css-class="w-[480px]">
              <div class="font-bold text-lg mb-4">Add New Board</div>
              <Form @submit="onSubmit" @invalid-submit="onInvalidSubmit" :validation-schema="yup.object().shape({
                name: yup.string().required(),
                columns: yup.array().of(yup.string().required()),
              })" :initial-values="{ name: '', columns: [''] }">
                <div class="mb-4">
                  <label for="name" class="font-semibold text-xs text-slate-400 dark:text-white block mb-2">Name</label>
                  <Input name="name" type="text" />
                </div>
                <div class="mb-4">
                  <FieldArray name="columns" v-slot="{ fields, push, remove }">
                    <div class="mb-4">
                      <div class="mb-2">
                        <label for="name"
                          class="font-semibold text-xs text-slate-400 dark:text-white block mb-2">Columns</label>
                      </div>
                      <div v-for="(field, index) in fields" class="flex items-center mb-2">
                        <Input :name="`columns[${index}]`" type="text" />
                        <button v-show="fields.length > 1" @click="remove(index)" class="text-slate-400 p-2"
                          type="button">
                          <IconClose />
                        </button>
                      </div>
                    </div>
                    <Button v-show="fields.length < 6" @click="push('')" text="+ Add New Column" type="button"
                      class="block w-full" size="small" background-color="bg-white hover:bg-indigo-50"
                      color="text-primary" />
                  </FieldArray>
                </div>
                <Button class="w-full" type="submit" text="Create New Board" size="small" />
              </Form>
            </Modal>
          </nav>
        </div>

        <div class="shrink-0 pb-8">
          <div class="px-6 mb-4">
            <div
              class="flex items-center justify-center rounded-lg py-3.5 bg-indigo-50 dark:bg-dark text-slate-500 dark:text-slate-400">
              <IconMoonStar />
              <div class="p-[3px] rounded-full bg-primary w-[40px] h-[20px] flex hover:cursor-pointer mx-6"
                @click="toggleTheme()">
                <div class="rounded-full w-full h-full relative">
                  <div
                    :class="['w-[14px] h-[14px] rounded-full bg-white transition-all relative', theme === 'dark' ? 'left-0' : 'left-[calc(100%-14px)]']">
                  </div>
                </div>
              </div>
              <IconSun />
            </div>
          </div>
          <div
            class="flex items-center font-bold text-[15px] text-slate-400 hover:opacity-70 hover:cursor-pointer transition-colors pl-10">
            <span>
              <IconHide />
            </span><span>Hide Sidebar</span>
          </div>
        </div>
      </div>
    </aside>

    <main class="pl-[300px] pt-[96px] pb-[40px] flex w-full h-[100vh] overflow-hidden">
      <div class="beautify-scrollbar w-[100vw] h-[calc(100vh-96px)] overflow-auto">
        <div class="flex w-full h-full px-8 py-6">
          <div v-for="(c, index) in boardStore.board.columns" class="shrink-0 w-[286px] mr-7 flex flex-col">
            <div class="flex items-center mb-6">
              <div :class="['w-[14px] h-[14px] rounded-full mr-3', `bg-dot${index}`]"></div>
              <div class="uppercase font-semibold tracking-[3px] text-xs text-slate-400">{{ c.name }}({{ c.tasks.length
              }})</div>
            </div>

            <div class="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg h-full"></div>
          </div>

          <div class="shrink-0 w-[286px] flex flex-col">
            <div class="h-[44px]"></div>
            <div
              class="h-full bg-gradient-to-b dark:from-[#383942] dark:to-dark from-slate-200 to-light-theme-bg text-slate-400 dark:text-slate-400 hover:text-primary hover:cursor-pointer rounded-lg transition-colors flex items-center justify-center font-bold text-2xl">
              + New Column
            </div>
          </div>
          <div class="shrink-0 w-[100px]"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
