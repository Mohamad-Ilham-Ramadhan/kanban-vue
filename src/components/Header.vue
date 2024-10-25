<script setup>
import {ref, watch, watchEffect} from 'vue';
import { useIsMobile } from '../composables/isMobile';
import { Form, FieldArray } from 'vee-validate'
import * as yup from 'yup'
import { v4 as uuid } from 'uuid'
import IconEllipsis from '@/components/icons/IconEllipsis.vue';
import IconArrowDown from '@/components/icons/IconArrowDown.vue';
import IconMoonStar from '@/components/icons/IconMoonStar.vue';
import IconBoard from '@/components/icons/IconBoard.vue';
import IconSun from '@/components/icons/IconSun.vue'
import IconClose from '@/components/icons/IconClose.vue'
import Logo from '@/components/Logo.vue';
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import Input from '@/components/VeeValidate/Input.vue'
import Textarea from '@/components/VeeValidate/Textarea.vue'
import SelectVee from '@/components/VeeValidate/Select.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'


// store
import { useBoardStore } from '@/stores/board.js'
const boardStore = useBoardStore()
const boards = boardStore.boards;
const openModalMobile = ref(false);
const openModalAddTask = ref(false)
const openOption = ref(false)
const openModalEdit = ref(false)
const openModalDelete = ref(false)
const openSelectStatus = ref(false) // select status in add new task form
const { isMobile } = useIsMobile();

function toggleTheme() {
  document.documentElement.classList.toggle('dark')
  if (boardStore.theme === 0) boardStore.setTheme(1)
  else boardStore.setTheme(0)
}
const win = window;
const doc = document;
</script>

<template>
  <header
    class="flex flex-row items-center w-full h-[96px] fixed left-0 top-0 z-50 bg-white dark:bg-dark-light border-b border-b-slate-200 dark:border-b-slate-700"
  >
    <div
      class="shrink-0 w-[300px] h-full flex items-center border-r border-r-slate-200 dark:border-r-slate-700 pl-8 mobile:hidden"
    >
      <!-- <img src="@/assets/logo.svg" alt="logo"> -->
      <Logo />
    </div>
    
    <div class="flex flex-row w-full justify-between items-center px-4 md:px-8">
      <div class="mobile:block hidden shrink-0 mr-4">
        <img src="@/assets/logoMobile.svg" alt="logo" />
      </div>

      <div v-show="!isMobile" class="font-bold text-2xl mobile:mr-0 mobile:text-[20px]">
        {{ boardStore.board.name }}
      </div>

      <button
        v-show="isMobile"
        class="mr-auto flex items-center pr-4"
        @click="openModalMobile = !openModalMobile"
      >
        <div
          class="font-bold max-w-[50vw] overflow-hidden whitespace-nowrap md:text-2xl text-[18px] mr-0"
        >
          {{ boardStore.board.name }}
        </div>
        <IconArrowDown class="w-[18px] h-[18px] shrink-0 text-primary translate-y-1" />
      </button>

      <!-- Modal mobile menu -->
      <Modal
        :open="openModalMobile"
        @close-modal="openModalMobile = !openModalMobile"
        class="w-[300px] py-6"
      >
        <div
          class="uppercase text-[.725rem] text-slate-500 dark:text-slate-400 font-bold tracking-[.175rem] pl-8 mb-4"
        >
          all boards ({{ boardStore.boards.length }})
        </div>

        <nav class="flex flex-col justify-between pr-8 mb-2">
          <li
            v-for="(b, index) in boards"
            :key="b.id"
            :class="[
              'list-none font-bold flex items-center hover:bg-primary-light hover:text-white dark:hover:text-white hover:cursor-pointer pl-8 py-2.5 rounded-r-[30px] mb-1',
              boardStore.activeBoardIndex === index
                ? 'bg-primary text-white'
                : 'dark:text-slate-400 text-slate-500'
            ]"
            @click="
              () => {
                boardStore.setActiveBoardIndex(index)
                openModalMobile = false
              }
            "
          >
            <IconBoard class="mr-4 shrink-0" />
            <div>{{ b.name }}</div>
          </li>

          <li class="list-none">
            <button
              class="flex items-center font-bold pl-8 py-2.5 list-none text-primary hover:opacity-60 hover:cursor-pointer transition-opacity"
              @click="
                () => {
                  openCreateNewBoard = true
                  openModalMobile = false
                }
              "
            >
              <span class="mr-4">
                <IconBoard />
              </span>
              <span>+ Create New Board</span>
            </button>
          </li>
        </nav>

        <div class="px-8 mb-4">
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
      </Modal>
      <!-- Modal mobile menu (end) -->

      <div class="flex items-center">
        <Button
          :class="['md:mr-4 mr-1', isMobile && 'px-4 py-2']"
          @click="() => {
            openModalAddTask = true;
            win.setTimeout(() => {
              console.log('focus title', doc.getElementById('title'))
              // doc.getElementById('title')?.focus()
              doc.querySelector('input#title')?.focus()
            });
          }"
          :size="isMobile ? 'custom' : 'medium'"
        >
          <svg v-show="isMobile" width="12" height="12" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#FFF"
              d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"
            ></path>
          </svg>
          {{ !isMobile ? '+ Add New Task' : '' }}
        </Button>

        <!-- Modal add new task -->
        <Modal
          :open="openModalAddTask"
          @close-modal="openModalAddTask = false"
          class="max-w-[480px] w-full p-8"
          :isFullscreen="isMobile ? true : false"
        >
          <Form
            @submit="
              (values) => {
                boardStore.addNewTask(values)
                openModalAddTask = false
              }
            "
            :validation-schema="
              yup.object().shape({
                title: yup.string().required('Required').test('unique-name', 'Used', (value) => {
                return boardStore.tasksTitleSet.has(value.trim().toLocaleLowerCase()) ? false : true;
                }),
                subtasks: yup.array().of(
                  yup.object().shape({
                    id: yup.string().required('Required'),
                    text: yup.string().required('Required'),
                    isDone: yup.boolean().required('Required')
                  })
                )
              })
            "
            :initial-values="{
              title: '',
              description: '',
              subtasks: [{ id: uuid(), text: '', isDone: false }],
              status: ''
            }"
          >
            <div class="text-lg font-bold mb-6">Add New Task</div>
            <div class="mb-4">
              <label for="title" class="block text-xs  font-bold mb-2">Title</label>
              <Input type="text" name="title" id="title" />
            </div>

            <div class="mb-4">
              <label for="title" class="block text-xs  font-bold mb-2">Description</label>
              <Textarea name="description" id="description" rows="4"/>
            </div>

            <FieldArray name="subtasks" v-slot="{ fields, push, remove }">
              <div class="mb-4">
                <div class="mb-2">
                  <label
                    for="name"
                    class="font-semibold text-xs text-slate-400 dark:text-white block mb-2"
                    >Subtasks</label
                  >
                </div>
                <div v-for="(field, index) in fields" :key="index" class="flex items-center mb-2">
                  <Input :name="`subtasks[${index}].text`" :value="field.value.text" type="text" />
                  <button @click="remove(index)" class="text-slate-400 p-2" type="button">
                    <IconClose />
                  </button>
                </div>
              </div>
              <Button
                v-show="fields.length < 6"
                @click="() => {
                  push({ id: uuid(), name: '', isDone: false })
                  win.setTimeout(() => {
                    doc.getElementById(`subtasks[${fields.length - 1}].text`).focus();
                  },1);
                }"
                text="+ Add New Subtask"
                type="button"
                class="block w-full mb-4"
                size="small"
                background-color="bg-indigo-50 hover:text-primary-hover dark:bg-slate-50 dark:hover:bg-gray-200"
                color="text-primary"
                >+ Add New Subtask</Button
              >
            </FieldArray>

            <div class="mb-6">
              <label
                for="status"
                class="font-semibold text-xs text-slate-400 dark:text-white block mb-2"
                >Status</label
              >
              <SelectVee
                :open="openSelectStatus"
                @open-select="openSelectStatus = true"
                @close-select="openSelectStatus = false"
                :items="boardStore.board.columns.map((c, i) => ({ name: c.name, index: i }))"
                name="status"
                renderValueProp="name"
                realValueProp="index"
              />
            </div>

            <div>
              <Button type="submit" size="small" class="w-full">Create Task</Button>
            </div>
          </Form>
        </Modal>
        <!-- Modal add new task [end] -->

        <div class="relative">
          <button
            @click="openOption = !openOption"
            class="block md:p-2.5 mobile:pl-2 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-dark transition-colors"
          >
            <IconEllipsis />
          </button>

          <DropdownMenu
            right="right-0"
            :open="openOption"
            editText="Edit Board"
            deleteText="Delete Board"
            @on-click-edit="
              () => {
                openModalEdit = true;
                openOption = false;
                win.setTimeout(() => {
                  doc.getElementById('name')?.focus()
                })
              }
            "
            @on-click-delete="
              () => {
                openModalDelete = true
                openOption = false
                win.setTimeout(() => {
                  doc.getElementById('button-delete')?.focus()
                })
              }
            "
            @on-click-overlay="openOption = true"
          />

          <div v-show="openOption" @click="openOption = false" class="fixed z-[100] inset-0"></div>
        </div>

        <!-- Modal Delete Board -->
        <Modal
          :open="openModalDelete"
          @close-modal="openModalDelete = false"
          class="max-w-[480px] w-full p-8"
          :isFullscreen="isMobile"
        >
          <div class="text-red-450 font-bold text-lg mb-4">Delete this board?</div>
          <div class="text-[.8rem] text-slate-400 font-semibold leading-6 mb-6">
            Are you sure you want to delete the '{{ boardStore.board.name }}' board? This action
            will remove all columns and tasks and cannot be reversed.
          </div>
          <div class="flex justify-between">
            <Button
              @click="
                () => {
                  boardStore.deleteActiveBoard()
                  openModalDelete = false
                }
              "
              id="button-delete"
              size="small"
              class="w-full mr-2"
              background-color="bg-red-450 transition-opacity hover:opacity-70"
              color="text-white"
              >Delete</Button
            >
            <Button
              @click="openModalDelete = false"
              size="small"
              class="w-full ml-2"
              background-color="bg-indigo-50 transition-opacity dark:bg-white hover:opacity-70"
              color="text-primary"
              >Cancel</Button
            >
          </div>
        </Modal>

        <!-- Modal Edit Board -->
        <Modal
          :open="openModalEdit"
          @close-modal="openModalEdit = false"
          class="max-w-[480px] w-full p-8"
          :isFullscreen="isMobile"
        >
          <div class="font-bold text-lg mb-4">Edit Board</div>
          <Form
            @submit="
              (values) => {
                boardStore.addNewcolumn(values.columns.map((c) => ({ ...c, name: c.name.trim() })))
                boardStore.setName(values.name.trim())
                openModalEdit = false
              }
            "
            :validation-schema="
              yup.object().shape({
                name: yup.string().required('Required').test('unique-name', 'Used', (value) => {
                  value = value.toLocaleLowerCase().trim();
                  if (value === boardStore.board.name.toLocaleLowerCase().trim()) return true;
                  return boardStore.boardsNameSet.has(value) ? false : true;
                }),
                columns: yup.array().of(
                  yup.object().shape({
                    name: yup.string().required('Required').test('unique-name', 'Used', (value, context) => {
                      // @ts-ignore
                      const columns = context.from[1].value.columns;
                      const match = context?.path?.match(/\d+/)
                      let index;
                      if (match !== null) {
                        index = Number(match[0])
                      }
                      let unique = true;
                      columns.some( (c, i) => {
                        const {name} = c;
                        if (!name) return true;
                        if (i === index) return true;
                        if (name.toLowerCase().trim() === value.toLocaleLowerCase().trim()) unique = false

                      });
                      return unique;
                    })
                  })
                )
              })
            "
            :initial-values="{ name: boardStore.board.name, columns: boardStore.board.columns }"
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
                  <div v-for="(field, index) in fields" :key="index" class="flex items-center mb-2">
                    <Input :name="`columns[${index}].name`" :value="field.value.name" type="text" />
                    <button
                      v-show="fields.length > 1"
                      @click="remove(index)"
                      :class="[
                        'text-slate-400 p-2',
                        field.value.tasks.length > 0 ? 'opacity-30' : ''
                      ]"
                      type="button"
                      :disabled="field.value.tasks.length > 0"
                    >
                      <IconClose />
                    </button>
                  </div>
                </div>
                <Button
                  v-show="fields.length < 6"
                  @click="() => {
                    push({ name: '', tasks: [] })
                    win.setTimeout(() => {
                      doc.getElementById(`columns[${fields.length - 1}].name`).focus()
                    }, 1);
                  }"
                  type="button"
                  class="block w-full"
                  size="small"
                  background-color="bg-indigo-50 hover:text-primary-hover dark:bg-slate-50 dark:hover:bg-gray-200"
                  color="text-primary"
                  >+ Add New Column</Button
                >
              </FieldArray>
            </div>
            <Button class="w-full" type="submit" size="small">Save Changes</Button>
          </Form>
        </Modal>
      </div>
    </div>
  </header>
</template>
