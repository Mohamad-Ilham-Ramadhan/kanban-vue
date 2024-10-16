<script setup>
import {ref} from 'vue';
import { Form, FieldArray } from 'vee-validate';
import * as yup from 'yup';
import { useIsMobile } from '../composables/isMobile';
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import Input from '@/components/VeeValidate/Input.vue';
import IconSun from '@/components/icons/IconSun.vue';
import IconMoonStar from '@/components/icons/IconMoonStar.vue';
import IconBoard from '@/components/icons/IconBoard.vue';
import IconHide from '@/components/icons/IconHide.vue';
import IconEye from '@/components/icons/IconEye.vue';
import IconClose from '@/components/icons/IconClose.vue';

// store
import { useBoardStore } from '@/stores/board.js';
const boardStore = useBoardStore();
const boards = boardStore.boards;
const boardNamesSet = new Set();
boards.forEach(b => boardNamesSet.add(b.name.toLowerCase().trim()));

const { isMobile } = useIsMobile()

const openCreateNewBoard = ref(false);

function toggleTheme() {
  document.documentElement.classList.toggle('dark')
  if (boardStore.theme === 0) boardStore.setTheme(1)
  else boardStore.setTheme(0)
}

const doc = document;
const win = window;
</script>

<template>
  <aside
    :class="[
      'shrink-0 w-[300px] h-[100vh] fixed left-0 top-0 z-40 dark:bg-dark-light bg-white border-r border-r-slate-200 dark:border-r-slate-700 pt-[96px] transition-transform mobile:hidden',
      boardStore.sidebar === false && '-translate-x-[300px]'
    ]"
  >
    <div class="flex flex-col justify-between h-full pt-4 beautify-scrollbar overflow-auto">
      <div class="shrink-0">
        <div
          class="uppercase text-[.735rem] text-slate-400 dark:text-slate-400 font-bold tracking-[.16rem] pl-8 mb-4"
        >
          all boards ({{ boardStore.boards.length }})
        </div>
        <nav class="flex flex-col justify-between pr-6 mb-2">
          <li
            v-for="(b, index) in boards"
            :key="b.id"
            :class="[
              'list-none font-bold flex items-center hover:bg-primary-light hover:text-white dark:hover:text-white transition-colors hover:cursor-pointer pl-8 py-2.5 rounded-r-full mb-1',
              boardStore.activeBoardIndex === index
                ? 'bg-primary text-white'
                : 'dark:text-slate-400 text-slate-400'
            ]"
            @click="boardStore.setActiveBoardIndex(index)"
          >
            <IconBoard class="mr-4" />
            <div>{{ b.name }}</div>
          </li>

          <li
            class="flex items-center font-bold pl-8 py-2.5 list-none text-primary hover:opacity-60 hover:cursor-pointer transition-opacity"
            @click="openCreateNewBoard = true"
          >
            <span class="mr-4">
              <IconBoard />
            </span>
            <span>+ Create New Board</span>
          </li>
          <!-- Modal create new board -->
          <Modal
            :open="openCreateNewBoard"
            @close-modal="openCreateNewBoard = false"
            class="max-w-[480px] w-full p-8"
            :isFullscreen="isMobile"
          >
            <div class="font-bold text-lg mb-4">Add New Board</div>
            <Form
              @submit="
                (values) => {
                  boardStore.createNewBoard(values)
                  openCreateNewBoard = false
                  boardStore.setActiveBoardIndex(boardStore.boards.length - 1)
                }
              "
              @invalid-submit="() => {}"
              :validation-schema="
                yup.object().shape({
                  name: yup.string().required('Required').test('unique-name', 'Used', (value) => {
                    return boardNamesSet.has(value)  ? false : true;
                  }),
                  columns: yup.array().of(yup.string().required('Required'))
                })
              "
              :initial-values="{name: '', columns: ['']}"
            >
              <div class="mb-4">
                <label
                  for="name"
                  class="font-semibold text-xs text-slate-400 dark:text-white block mb-2"
                  >Name</label
                >
                <Input name="name" type="text" />
              </div>
              <div class="mb-4">
                <FieldArray name="columns" v-slot="{ fields, push, remove }">
                  <div class="mb-4">
                    <div class="mb-2">
                      <label
                        for="name"
                        class="font-semibold text-xs text-slate-400 dark:text-white block mb-2"
                        >Columns</label
                      >
                    </div>
                    <div
                      v-for="(field, index) in fields"
                      :key="index"
                      class="flex items-center mb-2"
                    >
                      <Input :name="`columns[${index}]`" type="text" />
                      <button
                        v-show="fields.length > 1"
                        @click="remove(index)"
                        class="text-slate-400 p-2"
                        type="button"
                      >
                        <IconClose class="" />
                      </button>
                    </div>
                  </div>
                  <Button
                    v-show="fields.length < 6"
                    @click="() => {
                      push('')
                      console.log('input', fields.length)

                      win.setTimeout(() => { // Focus the last inserted input. Need setTimeout so .focus() method executed after input element inserted on DOM.
                        doc.getElementById(`columns[${fields.length - 1}]`).focus()
                      }, 1);
                    }"
                    text="+ Add New Column"
                    type="button"
                    class="block w-full"
                    size="small"
                    background-color="bg-indigo-50 hover:text-primary-hover dark:bg-slate-50 dark:hover:bg-gray-200"
                    color="text-primary"
                    >+ Add New Column</Button
                  >
                </FieldArray>
              </div>
              <Button class="w-full" type="submit" size="small">Create New Board</Button>
            </Form>
          </Modal>

        </nav>
      </div>

      <div class="shrink-0 pb-8">
        <div class="px-6 mb-4">
          <div
            class="flex items-center justify-center rounded-lg py-3.5 bg-indigo-50 dark:bg-dark text-slate-500 dark:text-slate-400"
          >
            <IconMoonStar />
            <div
              class="p-[3px] rounded-full bg-primary w-[40px] h-[20px] flex hover:cursor-pointer mx-6"
              @click="toggleTheme()"
            >
              <div class="rounded-full w-full h-full relative">
                <div
                  :class="[
                    'w-[14px] h-[14px] rounded-full bg-white transition-all relative',
                    boardStore.theme === 0 ? 'left-0' : 'left-[calc(100%-14px)]'
                  ]"
                ></div>
              </div>
            </div>
            <IconSun />
          </div>
        </div>

        <button
          class="flex items-center font-bold text-[15px] text-slate-400 hover:opacity-70 hover:cursor-pointer transition-colors pl-10"
          @click="
            () => {
              boardStore.setSidebar()
            }
          "
        >
          <span> <IconHide /> </span><span>Hide Sidebar</span>
        </button>
        <Teleport to="body">
          <button
            :class="[
              'fixed left-0 bottom-[30px] h-[48px] w-[56px] flex justify-center items-center rounded-r-full hover:cursor-pointer bg-primary transition-opacity duration-500',
              boardStore.sidebar === false ? 'opacity-1' : 'opacity-0'
            ]"
            @click="boardStore.setSidebar()"
            title="Show sidebar"
          >
            <IconEye class="text-white" />
          </button>
        </Teleport>
      </div>
    </div>
  </aside>
</template>
