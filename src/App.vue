<script setup>
import { ref, watch } from 'vue'
import Logo from '@/components/Logo.vue'
import Button from './components/Button.vue'
import IconEllipsis from '@/components/icons/IconEllipsis.vue'
import IconBoard from '@/components/icons/IconBoard.vue'
import IconMoonStar from '@/components/icons/IconMoonStar.vue'
import IconSun from '@/components/icons/IconSun.vue'
import IconHide from '@/components/icons/IconHide.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import Modal from '@/components/Modal.vue'
import Input from '@/components/VeeValidate/Input.vue'
import Textarea from '@/components/VeeValidate/Textarea.vue'
import SelectVee from '@/components/VeeValidate/Select.vue'
import Select from '@/components/Select.vue'
import { Form, FieldArray } from 'vee-validate'
import * as yup from 'yup'
import { v4 as uuid } from 'uuid'

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

const openCreateNewBoard = ref(false)
const openOption = ref(false)
const openModalDelete = ref(false)
const openModalNewColumn = ref(false)
const openModalEdit = ref(false)
const openModalAddTask = ref(false)
const openSelectStatus = ref(false) // select status in add new task form
const openModalTask = ref(false)
const modalTaskData = ref({
  id: '',
  columnIndex: null,
  taskIndex: null,
  title: '',
  description: '',
  subtasks: []
})
watch(modalTaskData, () => {
  console.log('modal task data', modalTaskData)
})
const refDragScroll = ref(null)
const dragScroll = ref(false)
// const x = ref(0)

const doc = document
const win = window
const DOMMatrix = window.DOMMatrix

function moveScrollHandler(e) {
  refDragScroll.value.scrollLeft = refDragScroll.value.scrollLeft - e.movementX
}
function removeScrollHandler() {
  doc.body.classList.toggle('select-none')
  doc.removeEventListener('mousemove', moveScrollHandler)
  doc.removeEventListener('mouseup', removeScrollHandler)
  dragScroll.value = false
}

const tasksWrapperRefs = ref([])

// let shadowRect = {top:0, bottom:0, height: 0} // initial rect of dragged task
</script>

<template>
  <header
    class="flex flex-row items-center w-full h-[96px] fixed left-0 top-0 z-50 bg-white dark:bg-dark-light border-b border-b-slate-200 dark:border-b-slate-700"
  >
    <div
      class="shrink-0 w-[300px] h-full flex items-center border-r border-r-slate-200 dark:border-r-slate-700 pl-8"
    >
      <!-- <img src="@/assets/logo.svg" alt="logo"> -->
      <Logo />
    </div>
    <div class="flex flex-row w-full justify-between items-center px-8">
      <div class="font-bold text-2xl">{{ boardStore.board.name }}</div>
      <div class="flex items-center">
        <Button text="+ Add New Task" class="mr-4" @click="openModalAddTask = true" />
        <Modal :open="openModalAddTask" @close-modal="openModalAddTask = false" class="w-[480px]">
          <Form
            @submit="
              (values) => {
                console.log('submit add new task', values)
                boardStore.addNewTask(values)
                openModalAddTask = false
              }
            "
            :validation-schema="
              yup.object().shape({
                title: yup.string().required(),
                description: yup.string().required(),
                subtasks: yup.array().of(
                  yup.object().shape({
                    id: yup.string().required(),
                    text: yup.string().required(),
                    isDone: yup.boolean().required()
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
              <label for="title" class="block text-xs font-bold mb-2">Title</label>
              <Input type="text" name="title" id="title" />
            </div>

            <div class="mb-4">
              <label for="title" class="block text-xs font-bold mb-2">Description</label>
              <Textarea name="description" id="description" />
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
                <div v-for="(field, index) in fields" class="flex items-center mb-2">
                  <Input :name="`subtasks[${index}].text`" :value="field.value.text" type="text" />
                  <button @click="remove(index)" class="text-slate-400 p-2" type="button">
                    <IconClose />
                  </button>
                </div>
              </div>
              <Button
                v-show="fields.length < 6"
                @click="push({ id: uuid(), name: '', isDone: false })"
                text="+ Add New Subtask"
                type="button"
                class="block w-full mb-4"
                size="small"
                background-color="bg-white hover:bg-indigo-50"
                color="text-primary"
              />
            </FieldArray>

            <div class="mb-4">
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
              <Button text="Add" type="submit" />
            </div>
          </Form>
        </Modal>

        <div class="relative">
          <button
            @click="openOption = !openOption"
            class="block p-2.5 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-dark transition-colors"
          >
            <IconEllipsis />
          </button>

          <div
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
          </div>
          <div v-show="openOption" @click="openOption = false" class="fixed z-[100] inset-0"></div>
        </div>
        <!-- Modal Delete Board -->
        <Modal :open="openModalDelete" @close-modal="openModalDelete = false" class="w-[480px]">
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
              size="small"
              text="Delete"
              class="w-full mr-2"
              background-color="bg-red-450 hover:opacity-60"
              color="text-white"
            />
            <Button
              @click="openModalDelete = false"
              size="small"
              text="Cancel"
              class="w-full ml-2"
              background-color="bg-white hover:opacity-60"
              color="text-primary"
            />
          </div>
        </Modal>

        <!-- Modal Edit Board -->
        <Modal :open="openModalEdit" @close-modal="openModalEdit = false" class="w-[480px]">
          <div class="font-bold text-lg mb-4">Edit Board</div>
          <Form
            @submit="
              (values) => {
                console.log('SUBMIT form edit')
                boardStore.addNewcolumn(values.columns.map((c) => ({ ...c, name: c.name.trim() })))
                boardStore.setName(values.name.trim())
                openModalEdit = false
              }
            "
            :validation-schema="
              yup.object().shape({
                name: yup.string().required(),
                columns: yup.array().of(
                  yup.object().shape({
                    name: yup.string().required()
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
                  <div v-for="(field, index) in fields" class="flex items-center mb-2">
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
                  @click="push({ name: '', tasks: [] })"
                  text="+ Add New Column"
                  type="button"
                  class="block w-full"
                  size="small"
                  background-color="bg-white hover:bg-indigo-50"
                  color="text-primary"
                />
              </FieldArray>
            </div>
            <Button class="w-full" type="submit" text="Save Changes" size="small" />
          </Form>
        </Modal>
      </div>
    </div>
  </header>

  <div class="flex flex-row">
    <aside
      class="shrink-0 w-[300px] h-[100vh] fixed left-0 top-0 z-40 dark:bg-dark-light bg-white border-r border-r-slate-200 dark:border-r-slate-700 pt-[96px]"
    >
      <div class="flex flex-col justify-between h-full pt-4 beautify-scrollbar overflow-auto">
        <div class="shrink-0">
          <div
            class="uppercase text-[.7rem] text-slate-500 dark:text-slate-400 font-bold tracking-[.175rem] pl-8 mb-4"
          >
            all boards ({{ boardStore.boards.length }})
          </div>
          <nav class="flex flex-col justify-between pr-6 mb-2">
            <li
              v-for="(b, index) in boards"
              :key="b.id"
              :class="[
                'list-none font-bold flex items-center hover:bg-primary-light hover:text-white dark:hover:text-white hover:cursor-pointer pl-8 py-2.5 rounded-r-full mb-1',
                boardStore.activeIndex === index
                  ? 'bg-primary text-white'
                  : 'dark:text-slate-400 text-slate-500'
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
            <Modal
              :open="openCreateNewBoard"
              @close-modal="openCreateNewBoard = false"
              class="w-[480px]"
            >
              <div class="font-bold text-lg mb-4">Add New Board</div>
              <Form
                @submit="
                  (values) => {
                    boardStore.createNewBoard(values)
                    openCreateNewBoard = false
                    boardStore.setActiveIndex(boardStore.boards.length - 1)
                  }
                "
                @invalid-submit="() => {}"
                :validation-schema="
                  yup.object().shape({
                    name: yup.string().required(),
                    columns: yup.array().of(yup.string().required())
                  })
                "
                :initial-values="{ name: '', columns: [''] }"
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
                        <Input :name="`columns[${index}]`" type="text" />
                        <button
                          v-show="fields.length > 1"
                          @click="remove(index)"
                          class="text-slate-400 p-2"
                          type="button"
                        >
                          <IconClose />
                        </button>
                      </div>
                    </div>
                    <Button
                      v-show="fields.length < 6"
                      @click="push('')"
                      text="+ Add New Column"
                      type="button"
                      class="block w-full"
                      size="small"
                      background-color="bg-white hover:bg-indigo-50"
                      color="text-primary"
                    />
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
                      theme === 'dark' ? 'left-0' : 'left-[calc(100%-14px)]'
                    ]"
                  ></div>
                </div>
              </div>
              <IconSun />
            </div>
          </div>
          <div
            class="flex items-center font-bold text-[15px] text-slate-400 hover:opacity-70 hover:cursor-pointer transition-colors pl-10"
          >
            <span> <IconHide /> </span><span>Hide Sidebar</span>
          </div>
        </div>
      </div>
    </aside>

    <main class="pl-[300px] pt-[96px] pb-[40px] flex w-full h-[100vh] overflow-hidden">
      <div
        class="beautify-scrollbar w-[100vw] h-[calc(100vh-96px)] overflow-auto hover:cursor-col-resize"
        ref="refDragScroll"
        @mousedown="
          (e) => {
            dragScroll = true
            doc.body.classList.toggle('select-none')
            doc.addEventListener('mousemove', moveScrollHandler)
            doc.addEventListener('mouseup', removeScrollHandler)
          }
        "
      >
        <Teleport to="body">
          <div
            v-if="dragScroll"
            class="absolute inset-0 z-[1000]"
            id="scrolling-overlay"
            comment="to prevent hover effect of any element"
          ></div>
        </Teleport>

        <div class="flex w-full h-full px-8 py-6">
          <!-- Modal Task-->
          <Modal :open="openModalTask" @close-modal="openModalTask = false" class="w-[480px]">
            <div class="relative mb-6">
              <div class="font-bold">{{ boardStore.task.title }}</div>
              <button class="absolute top-0 right-0 text-slate-400 p-2 hover:cursor-pointer">
                <IconEllipsis class="" />
              </button>
            </div>
            <div class="text-xs font-semibold text-slate-400 mb-6">
              {{
                boardStore.task.description === '' ? 'No description' : boardStore.task.description
              }}
            </div>
            <label class="block text-xs font-bold mb-2"
              >Subtasks ({{
                boardStore.task.subtasks.reduce((acc, cv) => (cv.isDone ? acc + 1 : acc), 0)
              }}
              of {{ boardStore.task.subtasks.length }})</label
            >
            <div class="mb-4">
              <div
                v-for="(subtask, index) in boardStore.task.subtasks"
                class="rounded bg-dark p-3 flex items-center hover:cursor-pointer mb-2"
                @click="
                  () => {
                    boardStore.toggleSubtask(
                      boardStore.activeColumnIndex,
                      boardStore.activeTaskIndex,
                      index
                    )
                  }
                "
              >
                <div
                  :class="[
                    'flex justify-center items-center w-[17px] h-[17px] border border-slate-600 rounded-sm mr-2',
                    subtask.isDone ? 'bg-primary' : 'bg-dark-light'
                  ]"
                >
                  <IconCheck v-if="subtask.isDone" class="w-[10px] h-[10px]" />
                </div>
                <div
                  :class="['font-semibold text-xs', subtask.isDone && 'line-through text-gray-400']"
                >
                  {{ subtask.text }}
                </div>
              </div>
            </div>

            <label class="block font-bold text-xs mb-2">Current Status</label>
            <Select
              :open="openSelectStatus"
              @open-select="openSelectStatus = true"
              @close-select="openSelectStatus = false"
              :items="boardStore.board.columns.map((c, i) => ({ name: c.name, index: i }))"
              name="status"
              renderValueProp="name"
              realValueProp="index"
              :value="boardStore.board.columns[boardStore.activeColumnIndex]"
              :handleChange="
                (item) => {
                  console.log('selected item', item)
                  boardStore.changeTaskColumn(
                    boardStore.activeColumnIndex,
                    item.index,
                    boardStore.activeTaskIndex
                  )
                }
              "
            />
          </Modal>
          <!-- Modal Task-->

          <div
            v-for="(c, colIndex) in boardStore.board.columns"
            :key="c.id"
            class="column shrink-0 w-[286px] mr-16 flex flex-col"
          >
            <div class="flex items-center mb-6">
              <div :class="['w-[14px] h-[14px] rounded-full mr-3', `bg-dot${colIndex}`]"></div>
              <div class="uppercase font-semibold tracking-[3px] text-xs text-slate-400">
                {{ c.name }}({{ c.tasks.length }})
              </div>
            </div>

            <!-- card (tasks) -->
            <div
              v-show="c.tasks.length > 0"
              ref="tasksWrapperRefs"
              :data-column-index="colIndex"
              class="wrapper-task flex flex-col"
            >
              <div
                v-for="(t, index) in c.tasks"
                :key="t.id"
                class="card-task card-task-transition bg-white text-black dark:bg-dark-light dark:text-white rounded-lg dark:border dark:border-gray-750 shadow-md shadow-slate-200 dark:shadow-zinc-900 hover:cursor-grab select-none px-4 py-6 mb-4"
                data-moveable="0"
                :data-index="index"
                :data-y="0"
                :data-title="t.title"
                @mousedown="
                  (e) => {
                    console.log('mousedown')
                    // console.log('colummn index', colIndex)

                    const fromColumnIndex = colIndex
                    const fromIndex = index
                    let currentColumnIndex = colIndex
                    const $this = e.currentTarget
                    $this.classList.remove('card-task-transition')
                    const startIndex = $this.dataset.index
                    $this.dataset.moveable = '1'
                    $this.style.zIndex = '1000'
                    const r = $this.getBoundingClientRect()
                    let shadowRect = {
                      top: r.top,
                      bottom: r.bottom,
                      height: r.height,
                      left: r.left,
                      right: r.right
                    } // shadow Rect
                    const marginBottom = parseInt(win.getComputedStyle($this).marginBottom)

                    const shadowCard = doc.createElement('div')
                    shadowCard.style.height = `${r.height}px`
                    shadowCard.style.width = `${r.width}px`
                    shadowCard.style.position = 'absolute'
                    shadowCard.style.top = `${r.top}px`
                    shadowCard.style.left = `${r.left}px`
                    shadowCard.style.border = '1px solid white'
                    doc.body.appendChild(shadowCard)

                    let $movedCards = new Set();
                    let $movedCardsWhenThisOut = new Set();
                    
                    let $wrapper = tasksWrapperRefs[colIndex]

                    const rWrapper = $wrapper.getBoundingClientRect()
                    // let $rightWrapper = $wrapper.parentElement.nextElementSibling.querySelector('.wrapper-task')
                    let $rightWrapper = tasksWrapperRefs[colIndex + 1]
                    let $leftWrapper = tasksWrapperRefs[colIndex - 1]

                    const dragCard = (e) => {
                      // PROBLEM:
                      /*
                        kanan kiri in/out ketika animation masih berjalan dan kita melakukan kanan/kiri in/out maka translateY pada cards acak2kan
                      */
                      isDragged = true
                      const $index = $this.dataset.index
                      const matrix = new DOMMatrix(win.getComputedStyle($this).transform) // to get value of current transform translate(x,y)
                      const tx = matrix.e
                      const ty = matrix.f
                      $this.style.transform = `translate(${tx + e.movementX}px, ${
                        ty + e.movementY
                      }px)`

                      const r = $this.getBoundingClientRect()
                      const midX = r.width / 2 + r.left

                      // HORIZONTAL
                      if (e.movementX > 0) {
                        // KANAN

                        if ($wrapper !== null && midX > $wrapper.getBoundingClientRect().right) {
                          // KANAN OUT
                          console.log('KANAN OUT')
                          $leftWrapper = $wrapper
                          $wrapper = null
                          currentColumnIndex = null

                          const leftTasksCount =
                            Number($leftWrapper.dataset.columnIndex) === fromColumnIndex
                              ? $leftWrapper.querySelectorAll('.card-task').length - 1
                              : $leftWrapper.querySelectorAll('.card-task').length

                          if ($this.dataset.index < leftTasksCount) {
                            // column issue
                            $leftWrapper.querySelectorAll('.card-task').forEach((n, i) => {
                              // geser
                              if (Number(n.dataset.index) > Number($this.dataset.index)) {
                                // add moved cards to reset translate later when $this card doesn't have current column
                                $movedCardsWhenThisOut.add(n)

                                const matrix = new DOMMatrix(win.getComputedStyle(n).transform)
                                const nTx = matrix.e
                                const nTy = matrix.f
                                const r = n.getBoundingClientRect() 
                                if (n.shadowRect === undefined) {
                                  n.shadowRect = {top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height, width: r.width};
                                  const sc = doc.createElement('div');
                                  sc.style.width = `${r.width}px`;
                                  sc.style.height = `${r.height}px`;
                                  sc.style.position = 'absolute';
                                  sc.style.zIndex = '-1';
                                  sc.style.top = `${r.top}px`
                                  sc.style.left = `${r.left}px`
                                  sc.style.border = '1px solid red';
                                  doc.body.appendChild(sc)
                                  n.shadowCard = sc
                                  console.log('n.shadowRect === undefined', n.shadowRect)
                                } else {
                                  console.log('n.shadowRect exist')
                                }

                                n.shadowRect.top = n.shadowRect.top - (shadowRect.height + marginBottom);
                                n.shadowCard.style.top = `${n.shadowRect.top}px`;
                                const calculation = Math.round(nTy - (r.top - n.shadowRect.top))
                                n.style.transform = `translate(${nTx}px, ${calculation}px)`
                                n.dataset.index = Number(n.dataset.index) - 1
                              }
                            })
                          }
                        } else if (
                          $wrapper === null &&
                          r.bottom > $rightWrapper.getBoundingClientRect().top &&
                          midX > $rightWrapper.getBoundingClientRect().left
                        ) {
                          // KIRI IN (masuk dari kiri)
                          console.log('KIRI IN')

                          $movedCardsWhenThisOut.clear();

                          $wrapper = $rightWrapper
                          currentColumnIndex = Number($wrapper.dataset.columnIndex)
                          $rightWrapper = tasksWrapperRefs[currentColumnIndex + 1]
                          $leftWrapper = tasksWrapperRefs[currentColumnIndex - 1]
                          const midY =
                            $this.getBoundingClientRect().top +
                            $this.getBoundingClientRect().height / 2
                          let newIndex = 0
                          let $top = null
                          $wrapper.querySelectorAll('.card-task').forEach((n, index) => {
                            if (n === $this) return
                            const nRect = n.getBoundingClientRect() 
                            if (
                              midY <= nRect.top ||
                              (midY >= nRect.top &&
                                midY <= nRect.bottom)
                            ) {
                              // geser ke bawah
                              console.log('geser', n.dataset.title)
                              const matrix = new DOMMatrix(win.getComputedStyle(n).transform)
                              const nTy = matrix.f

                              if (n.shadowRect === undefined) {
                                n.shadowRect = {top: nRect.top, bottom: nRect.bottom, left: nRect.left, right: nRect.right, height: nRect.height, width: nRect.width}
                                const nSCard = doc.createElement('div'); // n.shadowCard
                                nSCard.style.height = `${n.shadowRect.height}px`;
                                nSCard.style.width = `${n.shadowRect.width}px`;
                                nSCard.style.border = '1px solid red';
                                nSCard.style.position = 'absolute';
                                nSCard.style.top = `${n.shadowRect.top}px`;
                                nSCard.style.left = `${n.shadowRect.left}px`;
                                nSCard.style.zIndex = '-1'
                                doc.body.appendChild(nSCard)
                                n.shadowCard = nSCard;
                              }

                              n.shadowRect.top = n.shadowRect.top + shadowRect.height + marginBottom;
                              n.shadowCard.style.top = `${n.shadowRect.top}px`;

                              console.log('movement', n.shadowRect.top - nRect.top);
                              n.style.transform = `translate(0px, ${nTy + (n.shadowRect.top - nRect.top)}px)`;
                              n.dataset.index = Number(n.dataset.index) + 1

                            } else {
                              console.log('assign $top')
                              newIndex = Number(n.dataset.index) + 1
                              $top = n
                            }
                          })
                          // console.log('$top', $top)
                          $this.dataset.index = newIndex
                          shadowRect.left = $wrapper.getBoundingClientRect().left
                          shadowRect.right = $wrapper.getBoundingClientRect().right
                          shadowRect.top =
                            $top === null
                              ? $wrapper.getBoundingClientRect().top
                              : $top.getBoundingClientRect().bottom +
                                parseInt(win.getComputedStyle($top).marginBottom)
                          shadowRect.bottom = shadowRect.top + shadowRect.height
                          shadowCard.style.left = `${shadowRect.left}px`
                        }

                      } else if (e.movementX < 0) {
                        // KIRI

                        if (!!$wrapper && midX < $wrapper.getBoundingClientRect().left) {
                          // KIRI OUT
                          console.log('KIRI OUT')
                          $rightWrapper = $wrapper
                          $leftWrapper = tasksWrapperRefs[Number($wrapper.dataset.columnIndex) - 1]
                          $wrapper = null
                          currentColumnIndex = null
                          
                          // geser bawah tasks
                          $rightWrapper.querySelectorAll('.card-task').forEach((n, index) => {
                            if (n.dataset.index > $this.dataset.index) {
                              // add moved cards to reset translate later when $this card doesn't have current column
                              $movedCardsWhenThisOut.add(n)
                              const nRect = n.getBoundingClientRect();

                              if (n.shadowRect === undefined) {
                                console.log('n.shadowRect === undefined')
                                n.shadowRect = {top: nRect.top, bottom: nRect.bottom, left: nRect.left, right: nRect.right, height: nRect.height, width: nRect.width}
                                const nSCard = doc.createElement('div'); // n.ShadowCard
                                nSCard.style.height = `${nRect.height}px`;
                                nSCard.style.width = `${nRect.width}px`;
                                nSCard.style.position = 'absolute';
                                nSCard.style.zIndex = '-1';
                                nSCard.style.top = `${nRect.top}px`;
                                nSCard.style.left = `${nRect.left}px`;
                                nSCard.style.border = '1px solid red';
                                doc.body.appendChild(nSCard)
                                n.shadowCard = nSCard
                              } else {
                                console.log('n.shadowRect exist')
                              }

                              n.shadowRect.top = n.shadowRect.top - (shadowRect.height + marginBottom);
                              n.shadowCard.style.top = `${n.shadowRect.top}px`;
                              const nty = new DOMMatrix(win.getComputedStyle(n).transform).f // current translateY of n
                              n.style.transform = `translate(0px, ${nty - (nRect.top - n.shadowRect.top)}px)`
                              n.dataset.index = Number(n.dataset.index) - 1
                            }
                          })
                        } else if (
                          !!$wrapper === false &&
                          !!$leftWrapper &&
                          r.bottom > $leftWrapper.getBoundingClientRect().top &&
                          midX < $leftWrapper.getBoundingClientRect().right
                        ) {
                          // KANAN IN (masuk dari kanan)
                          console.log('KANAN IN')
                          $movedCardsWhenThisOut.clear();

                          $wrapper = $leftWrapper
                          $leftWrapper = tasksWrapperRefs[Number($wrapper.dataset.columnIndex) - 1]
                          currentColumnIndex = Number($wrapper.dataset.columnIndex)
                          let newIndex = 0
                          const midY = $this.getBoundingClientRect().top + shadowRect.height / 2
                          let $top = null

                          $wrapper.querySelectorAll('.card-task').forEach((n, index) => {
                            if (n == $this) return

                            const nRect = n.getBoundingClientRect()

                            if (midY < nRect.top || (midY > nRect.top && midY < nRect.bottom)) {
                              // MOVE CARDS
                              console.log('n', n)
                              n.dataset.index = Number(n.dataset.index) + 1
                              nty = new DOMMatrix(win.getComputedStyle(n).transform).f // n's current translate y
                              
                              if (n.shadowRect === undefined) {
                                console.log('n.shadowRect === undefined')
                                n.shadowRect = {top: nRect.top, bottom: nRect.bottom, left: nRect.left, right: nRect.right, height: nRect.height, width: nRect.width}
                                const nSCard = doc.createElement('div');
                                nSCard.style.height = `${n.shadowRect.height}px`;
                                nSCard.style.width = `${n.shadowRect.width}px`;
                                nSCard.style.border = '1px solid red';
                                nSCard.style.position = 'absolute';
                                nSCard.style.top = `${n.shadowRect.top}px`;
                                nSCard.style.left = `${n.shadowRect.left}px`;
                                nSCard.style.zIndex = '-1'
                                doc.body.appendChild(nSCard)
                                n.shadowCard = nSCard;
                              } else {
                                console.log('n.shadowRect exist')
                              }

                              n.shadowCard.style.top = `${n.shadowRect.top}px`;

                              n.shadowRect.top = n.shadowRect.top + (shadowRect.height + marginBottom)
                              console.log('movement', (n.shadowRect.top - nRect.top))
                              n.style.transform = `translate(0px, ${nty + (n.shadowRect.top - nRect.top)}px`;
                            } else {
                              newIndex = Number(n.dataset.index) + 1
                              $top = n
                            }
                          })

                          $this.dataset.index = newIndex
                          shadowRect.left = $wrapper.getBoundingClientRect().left
                          shadowRect.right = $wrapper.getBoundingClientRect().right
                          shadowRect.top =
                            $top === null
                              ? $wrapper.getBoundingClientRect().top
                              : $top.getBoundingClientRect().bottom +
                                parseInt(win.getComputedStyle($top).marginBottom)
                          shadowRect.bottom = shadowRect.top + shadowRect.height;
                          shadowCard.style.left = `${shadowRect.left}px`;

                        }
                      }

                      if ($wrapper == null) return

                      // VERTICAL

                      if (e.movementY < 0) { // ATAS

                        // TOP OUT 
                        if (typeof currentColumnIndex === 'number' && r.bottom < $wrapper.getBoundingClientRect().top) {
                          // ISSUE: when card still animating
                          console.log('TOP OUT')
                          currentColumnIndex = null;
                          // move the rest card in $wrapper
                          $wrapper.querySelectorAll('.card-task').forEach((c, index) => {
                            if (c === $this) return 
                            const cTy = new DOMMatrix(win.getComputedStyle(c).transform).f;// current translate Y
                            const cRect = c.getBoundingClientRect()
                            const moveY = r.height + marginBottom
                            c.shadowRect = {top: cRect - moveY, bottom: (cRect - moveY) + cRect.height, left: cRect.left, right: c.right, height: cRect.height, width: cRect.width};
                            c.style.transform = `translate(0px, ${cTy - moveY}px)`
                          });
                          $wrapper = null;
                        }

                        if ($index == 0) return

                        const $topCard = Array.from($wrapper.querySelectorAll('.card-task')).find(
                          ($el) => Number($el.dataset.index) == Number($this.dataset.index) - 1
                        ) // cause of error
                        // console.log('$this index',$this.dataset.index ,'$topCard', $topCard)
                        const rTopCard = $topCard.getBoundingClientRect() // error

                        const topTy = new DOMMatrix(win.getComputedStyle($topCard).transform).f // to get value of current transform translate(x,y)

                        const swapThreshold = rTopCard.top + rTopCard.height / 2

                        if (r.top < swapThreshold) { // SWAP ATAS
                          console.log('SWAP ATAS')
                          if ($topCard.shadowRect === undefined) {
                            $topCard.shadowRect = {top: rTopCard.top, bottom: rTopCard.bottom, height: rTopCard.height, width: rTopCard.width, left: rTopCard.left, right: rTopCard.right}
                            const sc = doc.createElement('div'); // shadowCard
                            sc.style.height = `${$topCard.shadowRect.height}px`;
                            sc.style.width = `${$topCard.shadowRect.width}px`;
                            sc.style.position = 'absolute';
                            sc.style.zIndex = '-1';
                            sc.style.top = `${$topCard.shadowRect.top}px`;
                            sc.style.left = `${$topCard.shadowRect.left}px`;
                            sc.style.border = '1px solid red';
                            doc.body.appendChild(sc)
                            $topCard.shadowCard = sc;
                          }
                          const bottom = shadowRect.bottom 
                          shadowRect.top = $topCard.shadowRect.top;
                          shadowRect.bottom = $topCard.shadowRect.top + shadowRect.height;
                          $topCard.shadowRect.bottom = bottom
                          $topCard.shadowRect.top = $topCard.shadowRect.bottom - $topCard.shadowRect.height;
                          $topCard.shadowCard.style.top = `${$topCard.shadowRect.top}px`;

                          const temp = $index
                          $this.dataset.index = $topCard.dataset.index
                          $topCard.dataset.index = temp

                          // transform.translate y
                          const nextY = topTy + ($topCard.shadowRect.bottom - rTopCard.top - rTopCard.height)
                          console.log('Swap Top', nextY)
                          $topCard.style.transform = `translate(0px, ${nextY}px)`
                          $topCard.dataset.y = nextY
                          if (!$movedCards.has($topCard)) {
                            console.log('add topcard to $movedCards', $movedCards)
                            $movedCards.add($topCard);
                          }
                          shadowCard.style.top = `${shadowRect.top}px`
                        }
                      } else if (e.movementY > 0) { // BAWAH
                        console.log('BAWAH')
                        const columnTasksLength =
                          currentColumnIndex === fromColumnIndex
                            ? boardStore.board.columns[currentColumnIndex].tasks.length - 1
                            : boardStore.board.columns[currentColumnIndex].tasks.length //
                        if ($this.dataset.index == columnTasksLength) return

                        const $botCard = Array.from($wrapper.querySelectorAll('.card-task')).find(
                          ($el) => Number($el.dataset.index) == Number($this.dataset.index) + 1
                        )
                        const rBotCard = $botCard.getBoundingClientRect()
                        const botTy = new DOMMatrix(win.getComputedStyle($botCard).transform).f // to get value of current transform translate(x,y)
                        const swapThreshold = rBotCard.top + rBotCard.height / 2
                        if (r.bottom > swapThreshold) {
                          console.log('SWAP BAWAH')
                          // const dataY = Number($botCard.dataset.y)
                          $botCard.dataset.y = Number($botCard.dataset.y) - Number(shadowRect.top)

                          if ($botCard.shadowRect === undefined) {
                            console.log('$botCard.shadowRect === undefined')
                            $botCard.shadowRect = {top: rBotCard.top, bottom: rBotCard.bottom, height: rBotCard.height, width: rBotCard.width, left: rBotCard.left, right: rBotCard.right}
                            const sc = doc.createElement('div'); // shadowCard
                            sc.style.height = `${$botCard.shadowRect.height}px`;
                            sc.style.width = `${$botCard.shadowRect.width}px`;
                            sc.style.position = 'absolute';
                            sc.style.zIndex = '-1';
                            sc.style.top = `${$botCard.shadowRect.top}px`;
                            sc.style.left = `${$botCard.shadowRect.left}px`;
                            sc.style.border = '1px solid red';
                            doc.body.appendChild(sc)
                            $botCard.shadowCard = sc;
                          } 

                          // move
                          const top = shadowRect.top
                          shadowRect.bottom = $botCard.shadowRect.bottom 
                          shadowRect.top = shadowRect.bottom - shadowRect.height
                          $botCard.shadowRect.top = top 
                          $botCard.shadowRect.bottom = top + $botCard.shadowRect.height
                          $botCard.shadowCard.style.top = `${$botCard.shadowRect.top}px`;

                          // index swap
                          const temp = $index
                          $this.dataset.index = $botCard.dataset.index
                          $botCard.dataset.index = temp

                          const nextY = botTy - (rBotCard.top - $botCard.shadowRect.top)
                          console.log('Swap Bottom', nextY)
                          $botCard.style.transform = `translate(0px, ${nextY}px)`
                          $botCard.dataset.y = nextY

                          shadowCard.style.top = `${shadowRect.top}px`

                          if (!$movedCards.has($botCard)) {
                            console.log('add botCard to $movedCards', $movedCards)
                            $movedCards.add($botCard);
                          }

                        }
                      }
                    }

                    const cancelDragCard = (e) => {
                      console.log('cancel drag card')
                      console.log('initial dragged card rect', r)
                      if (!isDragged) {
                        console.log('OPEN MODAL')
                        boardStore.setColumnAndTaskIndex(colIndex, index)
                        openModalTask = true
                      }

                      shadowCard.remove()
                      console.log('shadowRect', shadowRect)
                      console.log(
                        'update store',
                        fromColumnIndex,
                        currentColumnIndex,
                        fromIndex,
                        $this.dataset.index
                      )

                      // reset $this translate
                      $this.classList.add('card-task-transition')
                      const cr = $this.getBoundingClientRect() // current $this's rect
                      const matrix = new DOMMatrix(win.getComputedStyle($this).transform)
                      $this.dataset.moveable = '0'
                      $this.style.transform = `translate(${shadowRect.left - cr.left + matrix.e}px, ${
                        shadowRect.top - cr.top + matrix.f
                      }px)`;
                      $this.style.zIndex = '0'
                      
                      doc.removeEventListener('mousemove', dragCard)
                      doc.removeEventListener('mouseup', cancelDragCard)

                      // Ketika $this card tidak masuk di column manapun
                      if (currentColumnIndex === null) {
                        $movedCardsWhenThisOut.forEach( (c)  => {
                          const moveY = shadowRect.height + marginBottom;
                          const cTy = new DOMMatrix(win.getComputedStyle(c).transform).f; // card's current translateY
                          c.style.transform = `translate(0px, ${moveY + cTy}px)`;
                        })
                      }

                      win.setTimeout(() => {
                        // reset the rest translate
                        $this.classList.add('card-task-transition')

                        boardStore.swapTask(
                          fromColumnIndex,
                          currentColumnIndex,
                          startIndex,
                          $this.dataset.index
                        )
                        isDragged = false

                        // Clearing trasnlate and shadowRect of each cards
                        $movedCards.forEach( (c) => {
                          console.log('clear moved.shadowRect', c.shadowRect)
                          c.shadowRect = undefined
                        })
                        tasksWrapperRefs.forEach((w) => {
                          w.querySelectorAll('.card-task').forEach((n, index) => {
                            n.classList.remove('card-task-transition')
                            n.style.transform = 'translate(0px, 0px)'
                            n.dataset.index = index
                            win.setTimeout(() => {
                              n.classList.add('card-task-transition')
                            }, 50)
                          })
                        })
                      }, 1001) // harus sama dengan css transition duration-nya
                    }

                    doc.addEventListener('mousemove', dragCard)
                    doc.addEventListener('mouseup', cancelDragCard)
                    e.stopPropagation()
                  }
                "
              >
                <div class="font-bold text-[15px] mb-3">{{ t.title }}</div>
                <div class="text-xs text-slate-400 font-semibold">
                  {{ t.subtasks.filter((st) => st.isDone).length }} of
                  {{ t.subtasks.length }} subtasks
                </div>
              </div>
            </div>

            <div
              v-show="c.tasks.length === 0"
              class="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg h-full"
            ></div>
          </div>

          <div class="shrink-0 w-[286px] flex flex-col">
            <div class="h-[44px]"></div>
            <div
              class="h-full bg-gradient-to-b dark:from-dark-light dark:to-dark from-slate-200 to-light-theme-bg text-slate-400 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:cursor-pointer rounded-lg transition-colors shadow-md shadow-zinc-900 flex items-center justify-center font-bold text-2xl"
              @click="
                (e) => {
                  console.log('new column')
                  openModalNewColumn = true
                }
              "
              @mousedown="
                (e) => {
                  e.stopPropagation()
                }
              "
            >
              + New Column
            </div>
            <!-- Modal Add New Column -->
            <Modal
              :open="openModalNewColumn"
              @close-modal="openModalNewColumn = false"
              class="w-[480px]"
            >
              <div class="font-bold text-lg mb-4">Add New Column</div>
              <Form
                @submit="
                  (values) => {
                    boardStore.addNewcolumn(
                      values.columns.map((c) => ({ ...c, name: c.name.trim() }))
                    )
                    openModalNewColumn = false
                  }
                "
                @invalid-submit="() => {}"
                :validation-schema="
                  yup.object().shape({
                    columns: yup.array().of(
                      yup.object().shape({
                        name: yup.string().required()
                      })
                    )
                  })
                "
                :initial-values="{
                  name: boardStore.board.name,
                  columns: boardStore.board.columns
                }"
              >
                <div class="mb-4">
                  <label
                    for="name"
                    class="font-semibold text-xs text-slate-400 dark:text-white block mb-2"
                    >Name</label
                  >
                  <Input name="name" type="text" :disabled="true" />
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
                      <div v-for="(field, index) in fields" class="flex items-center mb-2">
                        <Input
                          :name="`columns[${index}].name`"
                          :value="field.value.name"
                          type="text"
                        />
                        <button
                          v-show="fields.length > 1"
                          :class="[
                            'text-slate-400 p-2',
                            field.value.tasks.length > 0 ? 'opacity-30' : ''
                          ]"
                          type="button"
                          :disabled="field.value.tasks.length > 0"
                          @click="remove(index)"
                        >
                          <IconClose />
                        </button>
                      </div>
                    </div>
                    <Button
                      v-show="fields.length < 6"
                      @click="push({ name: '', tasks: [] })"
                      text="+ Add New Column"
                      type="button"
                      class="block w-full"
                      size="small"
                      background-color="bg-white hover:bg-indigo-50"
                      color="text-primary"
                    />
                  </FieldArray>
                </div>
                <Button class="w-full" type="submit" text="Save Changes" size="small" />
              </Form>
            </Modal>
          </div>
          <div class="shrink-0 w-[100px]"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.card-task-transition {
  /* transition: transform cubic-bezier(.49,.79,.28,.96) .15s; */
  /* transition: transform linear 200ms; */
  /* transition: transform cubic-bezier(.32,.82,.4,.99) 200ms; */
  transition: transform cubic-bezier(.32,.82,.4,.99) 1000ms;
}
</style>
