<script setup>
import { ref, watch, onMounted } from 'vue'
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
                <div v-for="(field, index) in fields" :key="index" class="flex items-center mb-2">
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

        <div class="relative flex w-full h-full px-8 py-6" ref="boardFrameRef" id="column-wrapper">
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
                :key="subtask.id"
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
              class="task-wrapper flex flex-col h-full border border-red-300"
            >
              <div
                v-for="(t, index) in c.tasks"
                class="card-task card-task-transition bg-white text-black dark:bg-dark-light dark:text-white rounded-lg dark:border dark:border-gray-750 shadow-md shadow-slate-200 dark:shadow-zinc-900 hover:cursor-grab select-none px-4 py-6 mb-4 relative z-50"
                :key="t.id"
                data-moveable="0"
                :data-index="index"
                :data-y="0"
                :data-title="t.title"
                :data-is-animating="0"
                data-destination-y="0"
                @mousedown="
                  (e) => {
                    const $this = e.currentTarget;
                    const marginBottom = win.parseInt(win.getComputedStyle($this).marginBottom);
                    let $wrapper = $this.parentElement;
                    console.log('tasksWrapperRefs', tasksWrapperRefs.length);
                    let $leftWrapper = colIndex <= 0 ? null : tasksWrapperRefs[colIndex - 1];
                    let $rightWrapper = colIndex >= (tasksWrapperRefs.length - 1) ? null : tasksWrapperRefs[colIndex + 1];
                    const transitionDuration = parseFloat(win.getComputedStyle($this).transitionDuration) * 1000; // in ms
                    let isOut = false; // when the dragged card doesn't belong in any position

                    $this.classList.remove('card-task-transition')
                    $this.classList.remove('z-50')
                    $this.style.zIndex = '100';

                    // create shadowRect 
                    const rect = $this.getBoundingClientRect();
                    const $shadowRect = doc.createElement('div');
                    $shadowRect.style.height = `${rect.height}px`;
                    $shadowRect.style.width = `${rect.width}px`;
                    $shadowRect.style.position = 'absolute';
                    $shadowRect.style.top = `${rect.top}px`;
                    $shadowRect.style.left = `${rect.left}px`;
                    $shadowRect.style.border = '1px solid white';
                    doc.body.appendChild($shadowRect);

                    // $wrappers bouding rect
                    // const $wrappersRect = Array.from(doc.getElementById('column-wrapper').querySelectorAll('.column')).map( ($col) => {
                    //   return $col.querySelector('.task-wrapper').getBoundingClientRect();
                    // });
                    // console.log('$wrappersRect', $wrappersRect);
                    const $wrappers = Array.from(doc.getElementById('column-wrapper').querySelectorAll('.column')).map( ($col) => {
                      return $col.querySelector('.task-wrapper');
                    });

                    // In from Bottom
                    // In from Top
                    // In to empty $wrapper
                    // Pencatatan di .dataset nilai destinasi translateY, sehingga yang isAnimating = 1, bisa dikalkulate dengan benar
                    // ketika $this dilepas dan sedang transitioning lalu di drag kembali, ada problem.

                    let isDragged = false
                    let fromIndex = Number($this.dataset.index);
                    let $thisIndex = Number($this.dataset.index);
                    let startColumnIndex = Number(colIndex);
                    let endColumnIndex = Number(colIndex);
                    let movedCards = new Set([$this]);

                    let $botCard = $wrapper.querySelector(`.card-task[data-index='${$thisIndex + 1}']`);
                    let $topCard = $wrapper.querySelector(`.card-task[data-index='${$thisIndex - 1}']`);
                    
                    const dragCard = function (e) {
                      // console.log('drag card', e)

                      isDragged = true
                      const matrix = new DOMMatrix(win.getComputedStyle($this).transform) // to get value of current transform translate(x,y)
                      $this.style.transform = `translate(${matrix.e + e.movementX}px, ${
                        matrix.f + e.movementY
                      }px)`

                      if (e.movementY > 0) {
                        // DOWN
                        console.log('bawah')
                        
                        if (isOut == true) {
                          const $neoWrapper = doc.elementsFromPoint(e.clientX, e.clientY).find( ($el) => {
                            return $el.classList.contains('task-wrapper')
                          });

                          if ($neoWrapper !== undefined) {
                            console.log('IN FROM TOP')
                            console.log('first $card in the $neoWrapper', $neoWrapper.querySelector(`.card-task[data-index='${0}']`))
                            

                            $botCard = $neoWrapper.firstElementChild === $this ? $neoWrapper.children[1] : $neoWrapper.firstElementChild;
                            $topCard = null;

                            $shadowRect.style.top = `${$neoWrapper.getBoundingClientRect().top}px`;
                            $shadowRect.style.left = `${$neoWrapper.getBoundingClientRect().left}px`;
                            console.log('$neoWrapper', $neoWrapper.getBoundingClientRect());
                            console.log('$shadowRect', $shadowRect);
                            doc.body.appendChild($shadowRect);
                            
                            $neoWrapper.querySelectorAll('.card-task').forEach(($el) => {
                              if ($el === $this) return;
                              if (!!$el.getAnimations().length) {
                                console.log('IN FROM TOP $el still animating', $el.dataset.destinationY)
                              }
                              console.log('$el', $el, ((new DOMMatrix(win.getComputedStyle($el).transform))).f, Math.round(((new DOMMatrix(win.getComputedStyle($el).transform))).f + (marginBottom + $this.getBoundingClientRect().height)) )

                              // const destinationY = Math.round(((new DOMMatrix(win.getComputedStyle($el).transform))).f + (marginBottom + $this.getBoundingClientRect().height));
                              const destinationY = Number($el.dataset.destinationY) + (marginBottom + $this.getBoundingClientRect().height);
                              $el.style.transform = `translate(0px, ${destinationY}px)`;
                              $el.dataset.destinationY = destinationY;

                              movedCards.add($el);
                              
                              $el.dataset.index = Number($el.dataset.index) + 1;
                              $el.dataset.isAnimating = 1;

                              win.setTimeout(() => {
                                $el.dataset.isAnimating = 0;
                              }, transitionDuration + 1)
                            });

                            $wrapper = $neoWrapper;
                            isOut = false;
                            endColumnIndex = Number($wrapper.dataset.columnIndex);
                          }

                          return;
                        }

                        if (isOut == false && $botCard !== null && Number($botCard.dataset.isAnimating) == 0 && !!$botCard?.getAnimations().length == false && $botCard !== null && e.clientY > $botCard.getBoundingClientRect().top) {
                          console.log('SWAP BAWAH')
                          // move $shadowRect 
                          const moveY = ($botCard.getBoundingClientRect().height + marginBottom) + (new DOMMatrix(win.getComputedStyle($shadowRect).transform)).f;
                          $shadowRect.style.transform = `translate(0px, ${moveY}px)`;

                          // move $botCard
                          const moveYbot = Number($botCard.dataset.destinationY) - (rect.height + marginBottom);
                          $botCard.style.transform = `translate(0px, ${moveYbot}px)`;
                          $botCard.dataset.destinationY = moveYbot;

                          // add to movedCards
                          movedCards.add($botCard)
                          
                          // set data is-animating
                          $botCard.dataset.isAnimating = 1; // means true
                          const $temp = $botCard;
                          win.setTimeout(() => {
                            $temp.dataset.isAnimating = 0; // means false
                            console.log('set dataset isAnimating = false')
                          }, transitionDuration)

                          // swap index of both cards
                          $this.dataset.index = Number($this.dataset.index) + 1;
                          $botCard.dataset.index = Number($botCard.dataset.index) - 1;

                          // get next $botCard and $topCard
                          $botCard = $wrapper.querySelector(`.card-task[data-index='${Number($this.dataset.index) + 1}']`);
                          $topCard = $wrapper.querySelector(`.card-task[data-index='${Number($this.dataset.index) - 1}']`);

                        }
                      } else if (e.movementY < 0) {
                        // UP
                        console.log('up')

                        // OUT FROM TOP
                        if (isOut == false && e.clientY < $wrapper.getBoundingClientRect().top) {
                          console.log('OUT FROM TOP');

                          // fix ketika isAnimating=1 

                          $wrapper.querySelectorAll('.card-task').forEach(($c, index) => {
                            if ( Number($c.dataset.index) === 0) return; 
                            // console.log('$c isAnimation', $c.dataset.isAnimating, (new DOMMatrix(win.getComputedStyle($c).transform)).f)

                            const destinationY = Number($c.dataset.destinationY) - ($this.getBoundingClientRect().height + marginBottom);
                            console.log('$c.dataset.destinationY', $c.dataset.destinationY);
                            console.log('destinationY', destinationY);
                            $c.style.transform = `translate(0px, ${destinationY}px)`;
                            $c.dataset.destinationY = destinationY;
                            movedCards.add($c);
                            $c.dataset.index = Number($c.dataset.index) - 1;
                          })
                          $wrapper = null;
                          $shadowRect.remove();
                          $shadowRect.style.transform = 'translate(0px, 0px)';
                          isOut = true;
                          console.log('$leftWrapper', $leftWrapper);
                          console.log('$wrapper', $wrapper);
                          console.log('$rightWrapper', $rightWrapper);
                        }

                        if ($wrapper !== null && !!$topCard?.getAnimations().length == false && $topCard !== null && e.clientY < $topCard.getBoundingClientRect().bottom) {
                          console.log('swap atas')

                          // move $shadowRect 
                          const moveY = (new DOMMatrix(win.getComputedStyle($shadowRect).transform)).f - ($topCard.getBoundingClientRect().height + marginBottom);
                          $shadowRect.style.transform = `translate(0px, ${moveY}px)`;

                          // move $topCard
                          // const moveYtop = (rect.height + marginBottom) + (new DOMMatrix(win.getComputedStyle($topCard).transform)).f;
                          const moveYtop = Number($topCard.dataset.destinationY) + (rect.height + marginBottom);
                          $topCard.style.transform = `translate(0px, ${moveYtop}px)`;
                          $topCard.dataset.destinationY = moveYtop

                          // add to movedCards
                          movedCards.add($topCard)

                          $topCard.dataset.isAnimating = 1; // means true
                          const $temp = $topCard;
                          win.setTimeout(() => {$temp.dataset.isAnimating = 0;}, transitionDuration)

                          // swap index of both cards
                          $this.dataset.index = Number($this.dataset.index) - 1;
                          $topCard.dataset.index = Number($topCard.dataset.index) + 1;

                          // get next $topCard and $topCard
                          $botCard = $wrapper.querySelector(`.card-task[data-index='${Number($this.dataset.index) + 1}']`);
                          $topCard = $wrapper.querySelector(`.card-task[data-index='${Number($this.dataset.index) - 1}']`);
                        }
                      } else if (e.movementX > 0) { // RIGHT
                        console.log('RIGHT ->')

                        // Changing $leftWrapper, $wrapper, $rightWrapper 
                        
                        const $rightWrapperRect = !!$rightWrapper !== false ? $rightWrapper.getBoundingClientRect() : null;

                        if ($rightWrapper !== undefined && isOut == true && e.clientX >= $rightWrapperRect.left && (e.clientY < $rightWrapperRect.top || e.clientY > $rightWrapperRect.bottom)) {
                          console.log('Wrapper changing outside the box (wrapper)');
                          $wrapper = $rightWrapper;
                          $leftWrapper = $wrappers[Number($rightWrapper.dataset.columnIndex) - 1];
                          $rightWrapper = $wrappers[Number($rightWrapper.dataset.columnIndex) + 1];
                          console.log('$leftWrapper', $leftWrapper)
                          console.log('$wrapper', $wrapper)
                          console.log('$neoRightWrapper', $rightWrapper)
                          return;
                        }

                        if (isOut == false && e.clientX > $wrapper.getBoundingClientRect().right) {
                          console.log('OUT RIGHT ->')
                          $shadowRect.remove();
                          $shadowRect.style.transform = 'translate(0px, 0px)';
                          isOut = true;
                          $wrapper.querySelectorAll('.card-task').forEach(($c) => {
                            if (Number($c.dataset.index) <= Number($this.dataset.index)) return 
                            $c.style.transform = `translate(0px, ${(new DOMMatrix(win.getComputedStyle($c).transform)).f - (rect.height + marginBottom)}px)`;
                            $c.dataset.index = Number($c.dataset.index) - 1;
                            $c.dataset.isAnimating = 1;
                            win.setTimeout(() => {$c.dataset.isAnimating = 0;}, transitionDuration)
                            movedCards.add($c);
                          })
                          $leftWrapper = $wrapper;
                          $wrapper = null;
                          return;
                        }

                        const rightWrapperRect = $rightWrapper?.getBoundingClientRect();
                        if (rightWrapperRect !== undefined && e.clientX > rightWrapperRect.left && e.clientY >= rightWrapperRect.top && e.clientY <= rightWrapperRect.bottom) {

                          // tyding up all cards position after cancelDrag

                          console.log('--> IN FROM LEFT')
                          $wrapper = $rightWrapper;
                          const newWrapperIndex = Number($wrapper.dataset.columnIndex);
                          $rightWrapper = doc.getElementById('column-wrapper').querySelector(`.task-wrapper[data-column-index='${newWrapperIndex+1}']`);
                          endColumnIndex = Number($wrapper.dataset.columnIndex);
                          
                          // find new position for $this
                          let newIndex = null;
                          $wrapper.querySelectorAll('.card-task').forEach(($c) => {
                            if ($c === $this) return;
                            const $cRect = $c.getBoundingClientRect();
                            const $prevCRect = $c.previousElementSibling?.getBoundingClientRect();
                            if (newIndex === null && (e.clientY >= $cRect.top && e.clientY <= $cRect.bottom) || ($prevCRect !== undefined && e.clientY > $prevCRect.bottom && e.clientY < $cRect.top)) {
                              console.log('== IN ==')
                              isOut = false;
                              newIndex = Number($c.dataset.index);
                              $shadowRect.style.top = `${$cRect.top}px`;
                              $shadowRect.style.left = `${$cRect.left}px`;
                              doc.body.appendChild($shadowRect);
                              
                              $c.style.transform = `translate(0px, ${(new DOMMatrix(win.getComputedStyle($c).transform)).f + (rect.height + marginBottom)}px)`;
                              $c.dataset.index = Number($c.dataset.index) + 1;
                              $c.dataset.isAnimating = 1;
                              win.setTimeout(() => {$c.dataset.isAnimating = 0}, transitionDuration);

                              $topCard = newIndex - 1 < 0 ? null : $wrapper.querySelector(`.card-task[data-index='${newIndex - 1}']`);
                              $botCard = newIndex + 1 >= $wrapper.querySelectorAll('.card-task').length ? null : $wrapper.querySelector(`.card-task[data-index='${newIndex + 1}']`);

                              movedCards.add($c)
                              return;
                            }
                            if (newIndex !== null) { // next cards
                              $c.style.transform = `translate(0px, ${(new DOMMatrix(win.getComputedStyle($c).transform)).f + (rect.height + marginBottom)}px)`;
                              $c.dataset.index = Number($c.dataset.index) + 1;
                              $c.dataset.isAnimating = 1;
                              win.setTimeout(() => {$c.dataset.isAnimating = 0}, transitionDuration);
                              movedCards.add($c)
                            }
                          });

                          if (newIndex === null) {
                            // it means the dragged card are in the last position(most bottom)
                            console.log('Paling bawah')
                            isOut = false;

                            // index
                            newIndex = Number($wrapper.lastElementChild.dataset.index) + 1;
                            $this.dataset.index = newIndex;
                            // $shadowRect position
                            $shadowRect.style.left = `${$wrapper.getBoundingClientRect().left}px`;
                            $shadowRect.style.top = `${$wrapper.lastElementChild.getBoundingClientRect().bottom + marginBottom}px`;
                            doc.body.appendChild($shadowRect);

                            // $topCard & $bottomCard
                            $topCard = newIndex - 1 < 0 ? null : $wrapper.querySelector(`.card-task[data-index='${newIndex - 1}']`);
                            $botCard = newIndex + 1 >= $wrapper.querySelectorAll('.card-task').length ? null : $wrapper.querySelector(`.card-task[data-index='${newIndex + 1}']`);
                          }
                          console.log('newIndex', newIndex);
                          console.log('$shadowRect', $shadowRect);
                          $this.dataset.index = newIndex;
                        }
                      } else if (e.movementX < 0) { // LEFT 
                        console.log('<-- LEFT')

                        const $leftWrapperRect = !!$leftWrapper !== false ? $leftWrapper.getBoundingClientRect() : null;

                        if (!!$leftWrapper !== false && isOut == true && e.clientX >= $leftWrapperRect.right && (e.clientY < $leftWrapperRect.top || e.clientY > $leftWrapperRect.bottom)) {
                          console.log('Wrapper changing outside the box (wrapper)');
                          $wrapper = $leftWrapper;
                          $rightWrapper = $wrappers[Number($leftWrapper.dataset.columnIndex) + 1];
                          $leftWrapper = $wrappers[Number($leftWrapper.dataset.columnIndex) - 1];
                          console.log('$neoleftWrapper', $leftWrapper)
                          console.log('$wrapper', $wrapper)
                          console.log('$rightWrapper', $rightWrapper)
                          return;
                        }

                        if (isOut == false && e.clientX < $wrapper.getBoundingClientRect().left) {
                          console.log('<-- OUT LEFT')
                          $shadowRect.remove();
                          $shadowRect.style.transform = 'translate(0px, 0px)';
                          isOut = true;
                          $wrapper.querySelectorAll('.card-task').forEach(($c) => {
                            if (Number($c.dataset.index) <= Number($this.dataset.index)) return 
                            $c.style.transform = `translate(0px, ${(new DOMMatrix(win.getComputedStyle($c).transform)).f - (rect.height + marginBottom)}px)`;
                            $c.dataset.index = Number($c.dataset.index) - 1;
                            $c.dataset.isAnimating = 1;
                            win.setTimeout(() => {$c.dataset.isAnimating = 0;}, transitionDuration)
                            movedCards.add($c);
                          })
                          $rightWrapper = $wrapper;
                          $wrapper = null;
                          console.log('$leftWrapper', $leftWrapper);
                          console.log('$wrapper', $wrapper);
                          console.log('$rightWrapper', $rightWrapper);
                          return;
                        }

                        // after in left/right wrapper then back to the initial wrapper, the dragged card get translateY
                        // console.log('!!$leftWrapperRect !== false', !!$leftWrapperRect !== false)
                        if (isOut == true && !!$leftWrapperRect !== false && e.clientX < $leftWrapperRect.right && e.clientY >= $leftWrapperRect.top && e.clientY <= $leftWrapperRect.bottom) {

                          // tyding up all cards position after cancelDrag

                          console.log('<-- IN FROM RIGHT')
                          $wrapper = $leftWrapper;
                          const newWrapperIndex = Number($wrapper.dataset.columnIndex);
                          $leftWrapper = doc.getElementById('column-wrapper').querySelector(`.task-wrapper[data-column-index='${newWrapperIndex-1}']`);
                          endColumnIndex = Number($wrapper.dataset.columnIndex);
                          
                          // find new position for $this
                          let newIndex = null;
                          $wrapper.querySelectorAll('.card-task').forEach(($c) => {
                            if ($c === $this) return;
                            const $cRect = $c.getBoundingClientRect();
                            const $prevCRect = $c.previousElementSibling?.getBoundingClientRect();
                            if (newIndex === null && (e.clientY >= $cRect.top && e.clientY <= $cRect.bottom) || ($prevCRect !== undefined && e.clientY > $prevCRect.bottom && e.clientY < $cRect.top)) {
                              console.log('== IN ==')
                              isOut = false;
                              newIndex = Number($c.dataset.index);
                              $shadowRect.style.top = `${$cRect.top}px`;
                              $shadowRect.style.left = `${$cRect.left}px`;
                              doc.body.appendChild($shadowRect);
                              
                              $c.style.transform = `translate(0px, ${(new DOMMatrix(win.getComputedStyle($c).transform)).f + (rect.height + marginBottom)}px)`;
                              $c.dataset.index = Number($c.dataset.index) + 1;
                              $c.dataset.isAnimating = 1;
                              win.setTimeout(() => {$c.dataset.isAnimating = 0}, transitionDuration);

                              $topCard = newIndex - 1 < 0 ? null : $wrapper.querySelector(`.card-task[data-index='${newIndex - 1}']`);
                              $botCard = newIndex + 1 >= $wrapper.querySelectorAll('.card-task').length ? null : $wrapper.querySelector(`.card-task[data-index='${newIndex + 1}']`);

                              movedCards.add($c)
                              return;
                            }
                            if (newIndex !== null) { // trailing cards or next cards
                              $c.style.transform = `translate(0px, ${(new DOMMatrix(win.getComputedStyle($c).transform)).f + (rect.height + marginBottom)}px)`;
                              $c.dataset.index = Number($c.dataset.index) + 1;
                              $c.dataset.isAnimating = 1;
                              win.setTimeout(() => {$c.dataset.isAnimating = 0}, transitionDuration);
                              movedCards.add($c)
                            }
                          });

                          if (newIndex === null) {
                            // it means the dragged card are in the last position(most bottom)
                            console.log('Paling bawah')
                            isOut = false;

                            // index
                            newIndex = Number($wrapper.lastElementChild.dataset.index) + 1;
                            $this.dataset.index = newIndex;
                            // $shadowRect position
                            $shadowRect.style.left = `${$wrapper.getBoundingClientRect().left}px`;
                            $shadowRect.style.top = `${$wrapper.lastElementChild.getBoundingClientRect().bottom + marginBottom}px`;
                            doc.body.appendChild($shadowRect);

                            // $topCard & $bottomCard
                            $topCard = newIndex - 1 < 0 ? null : $wrapper.querySelector(`.card-task[data-index='${newIndex - 1}']`);
                            $botCard = newIndex + 1 >= $wrapper.querySelectorAll('.card-task').length ? null : $wrapper.querySelector(`.card-task[data-index='${newIndex + 1}']`);
                            console.log('$topCard',  $topCard)
                            console.log('$bottomCard',  $bottomCard)
                          }
                          console.log('newIndex', newIndex);
                          console.log('$shadowRect', $shadowRect);
                          $this.dataset.index = newIndex;
                        }
                      }
                    } 

                    const cancelDrag = function () {
                      console.log('cancel drag card')

                      if (!isDragged) {
                        console.log('OPEN MODAL')
                        boardStore.setColumnAndTaskIndex(colIndex, index)
                        openModalTask = true
                      }

                      $this.classList.add('card-task-transition')
                      $this.style.zIndex = '';
                      $this.classList.add('z-50');

                      

                      // If out of wrapper when cancel/release drag card
                      // (to be edit: if isOut then do this:)
                      console.log('isOut: ', isOut)
                      if (isOut) {
                        console.log('OUT OF wrapper')
                        // start index
                        // start column or start wrapper
                        console.log('from index', fromIndex);
                        console.log('start column index', startColumnIndex);
                        console.log('origin $wrapper', tasksWrapperRefs[startColumnIndex]);

                        // move $this to origin position
                        const moveX = $this.getBoundingClientRect().x - rect.x;
                        const moveY = $this.getBoundingClientRect().y - rect.y;
                        const matrix = new DOMMatrix(win.getComputedStyle($this).transform)
                        $this.style.transform = `translate(${matrix.e - moveX}px, ${matrix.f - moveY}px)`;


                        doc.getElementById('column-wrapper').querySelector(`.task-wrapper[data-column-index='${startColumnIndex}']`).querySelectorAll('.card-task').forEach(($c) => {
                          if (Number($c.dataset.index) < fromIndex || $c === $this) return;
                          console.log('moving card', $c)
                          $c.style.transform = 'translate(0px, 0px)';
                          $c.dataset.index = Number($c.dataset.index) + 1;
                        })

                        $this.dataset.index = fromIndex;

                      } else {

                        // move $this to shadow rect
                        const moveX = $this.getBoundingClientRect().x - $shadowRect.getBoundingClientRect().x;
                        const moveY = $this.getBoundingClientRect().y - $shadowRect.getBoundingClientRect().y;
                        const matrix = new DOMMatrix(win.getComputedStyle($this).transform)
                        $this.style.transform = `translate(${matrix.e - moveX}px, ${matrix.f - moveY}px)`;
                        
                        // update store 
                        win.setTimeout(() => {
                          // set translateY 0 to all moved cards
                          console.log('UPDATE STORE & TYDING MOVED CARDS')
                          
                          movedCards.forEach(($c) => {
                            // console.log('movedCards.forEach', $c)
                            $c.classList.remove('card-task-transition')
                            $c.style.transform = 'translate(0px, 0px)';
                            win.setTimeout(() => {
                              $c.classList.add('card-task-transition')
                              console.log('add transition class')
                            }, 10)
                          })
                          boardStore.swapTask(
                            startColumnIndex,
                            endColumnIndex,
                            fromIndex,
                            Number($this.dataset.index),
                          )
                        }, transitionDuration) // this setTimeout needs for dragged card get back to the position using transition
                      } // <-- if not out of wrapper

                      // remove $shadowRect
                      $shadowRect.remove();

                      doc.removeEventListener('mousemove', dragCard)
                      doc.removeEventListener('mouseup', cancelDrag)
                    } // <-- cancleDrag()

                    doc.addEventListener('mousemove', dragCard)
                    doc.addEventListener('mouseup', cancelDrag)
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
                      <div
                        v-for="(field, index) in fields"
                        :key="index"
                        class="flex items-center mb-2"
                      >
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
  transition: transform cubic-bezier(0.32, 0.82, 0.4, 0.99) 1200ms;
}
</style>
