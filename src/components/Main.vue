<script setup>
import { ref, onMounted, watch } from 'vue'
// import Logo from '@/components/Logo.vue';
import Button from '@/components/Button.vue'
import IconEllipsis from '@/components/icons/IconEllipsis.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
// import IconArrowDown from '@/components/icons/IconArrowDown.vue';
import Modal from '@/components/Modal.vue'
import Input from '@/components/VeeValidate/Input.vue'
import Textarea from '@/components/VeeValidate/Textarea.vue'
import SelectVee from '@/components/VeeValidate/Select.vue'
import Select from '@/components/Select.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import { Form, FieldArray } from 'vee-validate'
import * as yup from 'yup'
import { v4 as uuid } from 'uuid'
import { useIsMobile } from '@/composables/isMobile'
import { useBoardStore } from '@/stores/board.js'

const boardStore = useBoardStore()
// const boards = boardStore.boards;

onMounted(() => {
  if (boardStore.theme === 0) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
})

const openModalNewColumn = ref(false)
const openSelectStatus = ref(false) // select status in add new task form
const openModalTask = ref(false)
const openModalDeleteTask = ref(false)
const openModalEditTask = ref(false)
const modalTaskData = ref({
  id: '',
  columnIndex: null,
  taskIndex: null,
  title: '',
  description: '',
  subtasks: []
})
const openDropdownTask = ref(false)
watch(modalTaskData, () => {
})
const refDragScroll = ref(null)
const dragScroll = ref(false)
const preventDrag = ref(false) // prevent dragging $card-tasks
const isPreventMainScroll = ref(false) // prevent main scrollbar to scroll when draggin on mobile view

const { isMobile } = useIsMobile()

// === === ===
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

const dragDesktop = (args, e) => {
  const { colIndex, index } = args
  if (preventDrag.value) return

  const $this = e.currentTarget
  const marginBottom = win.parseInt(win.getComputedStyle($this).marginBottom)
  let $wrapper = $this.parentElement
  const $initialWrapper = $this.parentElement
  const transitionDuration = parseFloat(win.getComputedStyle($this).transitionDuration) * 1000 // in ms
  let isOut = false // when the dragged card doesn't belong in any position

  $this.classList.remove('card-task-transition')
  $this.classList.remove('z-50')
  $this.style.zIndex = '100'

  // create shadowRect
  const $thisRect = $this.getBoundingClientRect()
  const $shadowRect = doc.createElement('div')
  $shadowRect.style.height = `${$thisRect.height}px`
  $shadowRect.style.width = `${$thisRect.width}px`
  $shadowRect.style.position = 'absolute';
  // $shadowRect.style.zIndex = '10';
  // $shadowRect.style.border = 'red 1px solid';
  $shadowRect.style.top = `${$thisRect.top}px`
  $shadowRect.style.left = `${$thisRect.left}px`
  doc.body.appendChild($shadowRect)

  let isDragged = false
  let fromIndex = Number($this.dataset.index)
  // let $thisIndex = Number($this.dataset.index)
  let fromColumnIndex = Number(colIndex)
  let toColumnIndex = Number(colIndex)
  let movedCards = new Set([$this])
  // let $prevSwap = { card: null, direction: null } // direction { null | 1 = swap bottom, -1 = swap top}

  const $mainScroll = document.getElementById(`main-scroll`);
    if ($mainScroll === null) return;

    const mainScrollMaxScrollRight = Math.floor($mainScroll.scrollWidth - $mainScroll.clientWidth)
    const mainScrollMaxScrollBottom = Math.floor($mainScroll.scrollHeight - $mainScroll.clientHeight)
    
    // let lastThisRectLeft = $this.getBoundingClientRect().left;
    // let lastThisRectRight = $this.getBoundingClientRect().right;

    const setScrollIntervalId = window.setInterval(() => {
      if (!isDragged) return;
      // scroll when dragging out of frame
      const $thisRect = $this.getBoundingClientRect()
      const $thisMatrix = new DOMMatrix(window.getComputedStyle($this).transform)
      const $mainScrollRect = $mainScroll.getBoundingClientRect();

      // if ($thisRect.left >= 300) lastThisRectLeft = 300;
      // if ($thisRect.right <= window.innerWidth) lastThisRectRight = window.innerWidth;
      
      if ($thisRect.left < $mainScrollRect.left && $mainScroll.scrollLeft > 0) {
        // scroll left
        $this.style.transform = `translate(${Math.ceil($thisMatrix.e - 2)}px, ${$thisMatrix.f}px)`
        $mainScroll.scrollLeft = Math.ceil($mainScroll.scrollLeft - 2);
        $shadowRect.style.left = `${win.parseInt($shadowRect.style.left) + 2}px`;
      }

      if ($thisRect.right > $mainScrollRect.right && $mainScroll.scrollLeft < mainScrollMaxScrollRight) {
        // scroll right
        $this.style.transform = `translate(${Math.floor($thisMatrix.e + 2)}px, ${$thisMatrix.f}px)`
        $mainScroll.scrollLeft = Math.ceil($mainScroll.scrollLeft + 2)
        $shadowRect.style.left = `${win.parseInt($shadowRect.style.left) - 2}px`;
      }
  
      if ($thisRect.bottom > ($mainScrollRect.bottom - 50) && $mainScroll.scrollTop < mainScrollMaxScrollBottom) {
        // Scroll bottom
        $this.style.transform = `translate(${$thisMatrix.e}px, ${Math.ceil($thisMatrix.f + 2)}px)`;
        $mainScroll.scrollTop = Math.ceil($mainScroll.scrollTop + 2);
        $shadowRect.style.top = `${win.parseInt($shadowRect.style.top) - 2}px`;
      }
  
      if ($thisRect.top < ($mainScrollRect.top + 50) && $mainScroll.scrollTop > 0) {
        // scroll top
        $this.style.transform = `translate(${$thisMatrix.e}px, ${Math.ceil($thisMatrix.f - 2)}px)`
        $mainScroll.scrollTop = Math.ceil($mainScroll.scrollTop - 2)
        $shadowRect.style.top = `${win.parseInt($shadowRect.style.top) + 2}px`;
      }
    }, 5)
  

  const dragCard = (e) => {
    isDragged = true
    const matrix = new DOMMatrix(win.getComputedStyle($this).transform)
    $this.style.transform = `translate(${matrix.e + e.movementX}px, ${matrix.f + e.movementY}px)`
    
    if (isOut == false) {
      const $wrapperRect = $wrapper.getBoundingClientRect()

      if (
        e.clientX > $wrapperRect.right ||
        e.clientX < $wrapperRect.left ||
        e.clientY < $wrapperRect.top ||
        e.clientY > $wrapperRect.bottom
      ) {
        Array.from($wrapper.children).forEach(($el) => {
          if (Number($el.dataset.index) <= Number($this.dataset.index)) return

          $el.dataset.index = Number($el.dataset.index) - 1

          const destinationY = Number($el.dataset.destinationY) - (marginBottom + $thisRect.height)
          $el.style.transform = `translate(0px, ${destinationY}px)`
          $el.dataset.destinationY = destinationY

          movedCards.add($el)
        })

        const $temp = $wrapper
        $temp.dataset.isAnimating = 1
        win.setTimeout(() => {
          $temp.dataset.isAnimating = 0
        }, transitionDuration)

        $shadowRect.remove()
        isOut = true
        $wrapper = null
      }

      const $swapCards = doc.elementsFromPoint(e.clientX, e.clientY).filter(($el) => {
        if ($el === $this) return false
        return $el.classList.contains('card-task')
      })
      if (!!$swapCards.length && !!$swapCards[0].getAnimations().length == false) {
        const $swapCard = $swapCards[0]
        if (Number($this.dataset.index) < Number($swapCard.dataset.index) && e.movementY > 0) {

          const min = Math.min(Number($this.dataset.index), Number($swapCard.dataset.index))
          const max = Math.max(Number($this.dataset.index), Number($swapCard.dataset.index))
          Array.from($wrapper.children).forEach(($el) => {
            if ($el === $this || Number($el.dataset.index) > max || Number($el.dataset.index) < min)
              return
            $this.dataset.index = Number($this.dataset.index) + 1
            $el.dataset.index = Number($el.dataset.index) - 1

            $shadowRect.style.top = `${$el.getBoundingClientRect().bottom - $thisRect.height}px`
            $shadowRect.style.left = `${$el.getBoundingClientRect().left}px`

            const destinationY =
              Number($el.dataset.destinationY) - (marginBottom + $thisRect.height)
            $el.style.transform = `translate(0px, ${destinationY}px)`
            $el.dataset.destinationY = destinationY

            movedCards.add($el)
          })
        } else if (
          Number($this.dataset.index) > Number($swapCard.dataset.index) &&
          e.movementY < 0
        ) {

          const min = Math.min(Number($this.dataset.index), Number($swapCard.dataset.index))
          const max = Math.max(Number($this.dataset.index), Number($swapCard.dataset.index))
          let isFirst = false
          Array.from($wrapper.children).forEach(($el) => {
            if ($el === $this || Number($el.dataset.index) > max || Number($el.dataset.index) < min)
              return

            // swap vertical fix $shadowRect

            $this.dataset.index = Number($this.dataset.index) - 1
            $el.dataset.index = Number($el.dataset.index) + 1

            if (isFirst == false) {
              $shadowRect.style.top = `${$el.getBoundingClientRect().top}px`
              $shadowRect.style.left = `${$el.getBoundingClientRect().left}px`
              isFirst = true
            }

            const destinationY =
              Number($el.dataset.destinationY) + (marginBottom + $thisRect.height)
            $el.style.transform = `translate(0px, ${destinationY}px)`
            $el.dataset.destinationY = destinationY

            movedCards.add($el)
          })
        }
      }
      return
    }

    if (isOut) {
      // and
      const $neoWrapper = doc.elementsFromPoint(e.clientX, e.clientY).find(($el) => {
        return $el.classList.contains('task-wrapper')
      })

      if (!!$neoWrapper && $neoWrapper.childElementCount === 0) {
        $wrapper = $neoWrapper
        isOut = false
        $shadowRect.style.top = `${$wrapper.getBoundingClientRect().top}px`
        $shadowRect.style.left = `${$wrapper.getBoundingClientRect().left}px`
        doc.body.appendChild($shadowRect)

        $this.dataset.index = 0
        toColumnIndex = Number($wrapper.dataset.columnIndex)
        return
      }

      if (!!$neoWrapper && Number($neoWrapper.dataset.isAnimating) == 0) {

        toColumnIndex = Number($neoWrapper.dataset.columnIndex)
        $wrapper = $neoWrapper
        let isFirst = false
        let isMoved = false
        let $lastEl = null

        Array.from($wrapper.children).forEach(($el) => {
          if ($el === $this) return
          const $elRect = $el.getBoundingClientRect()
          // if (e.clientY <= $elRect.bottom && !!$el.getAnimations().length == false) {
          if (e.clientY <= $elRect.bottom) {
            isOut = false
            isMoved = true
            if (isFirst == false) {
              isFirst = true
              const diff =
                new DOMMatrix(win.getComputedStyle($el).transform).f -
                Number($el.dataset.destinationY)
              $this.dataset.index = $el.dataset.index
              $shadowRect.style.top = `${$elRect.top - diff}px`
              $shadowRect.style.left = `${$elRect.left}px`
              doc.body.appendChild($shadowRect)
            }

            $el.dataset.index = Number($el.dataset.index) + 1

            const destinationY =
              Number($el.dataset.destinationY) + (marginBottom + $thisRect.height)
            $el.style.transform = `translate(0px, ${destinationY}px)`
            $el.dataset.destinationY = destinationY

            movedCards.add($el)
          }

          $lastEl = $el
        })


        if (isMoved == false) {
          // insert into last position in a new wrapper or when wrapper is empty of any card (new wrapper is initial wrapper)
          // $lastEl === null ? empty wrapper : last position;
          isOut = false
          isMoved = true
          $this.dataset.index = $lastEl === null ? 0 : Number($lastEl.dataset.index) + 1

          const $wrapperRect = $wrapper.getBoundingClientRect()
          $shadowRect.style.left = `${$wrapperRect.left}px`
          const top =
            $lastEl === null
              ? $wrapperRect.top - marginBottom
              : $lastEl.getBoundingClientRect().bottom +
                Number($lastEl.dataset.destinationY) -
                new DOMMatrix(win.getComputedStyle($lastEl).transform).f
          $shadowRect.style.top = `${top + marginBottom}px`
          doc.body.appendChild($shadowRect)
        }
      }
      return
    } // Outside
  }

  const cancelDrag = () => {
    win.clearInterval(setScrollIntervalId);
    preventDrag.value = true
    win.setTimeout(() => {
      preventDrag.value = false
    }, transitionDuration)

    doc.removeEventListener('mousemove', dragCard)
    doc.removeEventListener('mouseup', cancelDrag)

    if (isDragged == false) {
      // open modal card
      boardStore.setColumnAndTaskIndex(colIndex, index)
      openModalTask.value = true
      boardStore.setColumnAndTaskIndex(fromColumnIndex, Number($this.dataset.index))
      $shadowRect.remove()
      return
    }

    if ($wrapper == null) {
      // if outside of wrapper when cancelDrag
      movedCards.forEach(($el) => {
        if ($this === $el) return
        $el.style.transform = 'translate(0px, 0px)'
      })

      // reset cards.dataset.index
      Array.from($initialWrapper.children).reduce((curIndex, $el) => {
        if ($el === $this || Number($el.dataset.index) < fromIndex) return curIndex
        $el.dataset.index = curIndex + 1
        return curIndex + 1
      }, fromIndex)

      $shadowRect.style.top = `${$thisRect.top}px`
      $shadowRect.style.left = `${$thisRect.left}px`
      doc.body.appendChild($shadowRect)
    }

    $this.classList.add('card-task-transition')

    // back to $shadowRect or back to initial position
    const moveX = $this.getBoundingClientRect().x - $shadowRect.getBoundingClientRect().x
    const moveY = $this.getBoundingClientRect().y - $shadowRect.getBoundingClientRect().y
    const matrix = new DOMMatrix(win.getComputedStyle($this).transform)
    $this.style.transform = `translate(${matrix.e - moveX}px, ${matrix.f - moveY}px)`

    $this.classList.remove('z-50')
    $this.style.zIndex = ''

    $shadowRect.remove()

    // update store
    win.setTimeout(() => {
      // if (isOut) return
      // set translateY 0 to all moved cards
      const unsubscribe = boardStore.$onAction(({ name, after }) => {
        after(() => {
          // after swapTask
          if (name == 'swapTask') {
            movedCards.forEach(($c) => {
              $c.classList.remove('card-task-transition')
              $c.style.transform = 'translate(0px, 0px)'
              $c.dataset.destinationY = 0
              win.setTimeout(() => {
                $c.classList.add('card-task-transition')
              }, 10) // needed so no transition
            })
            if (isOut) $this.dataset.index = fromIndex
          }
        })
      })
      boardStore.swapTask(
        fromColumnIndex,
        isOut ? fromColumnIndex : toColumnIndex,
        fromIndex,
        isOut ? fromIndex : Number($this.dataset.index)
      )
      unsubscribe()
    }, transitionDuration) // this setTimeout needs for dragged card get back to the position using transition
  }
  doc.addEventListener('mousemove', dragCard)
  doc.addEventListener('mouseup', cancelDrag)
  e.stopPropagation()
}

const dragMobile = (args, e) => {
  let { colIndex, index } = args
  e.stopPropagation()
  console.log('dragMobile e', e);
  let isDragged = false

  const $this = e.currentTarget
  const marginBottom = win.parseInt(win.getComputedStyle($this).marginBottom)
  let $wrapper = $this.parentElement
  const $wrappers = Array.from(doc.querySelectorAll('.task-wrapper'))
  const $initialWrapper = $this.parentElement
  const transitionDuration = parseFloat(win.getComputedStyle($this).transitionDuration) * 1000 // in ms
  let isOut = false // when the dragged card doesn't belong in any position

  $this.classList.remove('card-task-transition')
  $this.classList.remove('z-50')
  $this.style.zIndex = '100';

  // create shadowRect
  const $thisRect = $this.getBoundingClientRect()
  const $shadowRect = doc.createElement('div')
  $shadowRect.style.height = `${$thisRect.height}px`
  $shadowRect.style.width = `${1}px`
  $shadowRect.style.position = 'absolute'
  $shadowRect.style.top = `${$thisRect.top}px`
  $shadowRect.style.left = `${$thisRect.left}px`
  doc.body.appendChild($shadowRect)

  // let isDragged = false
  let fromIndex = Number($this.dataset.index)
  // let $thisIndex = Number($this.dataset.index)
  let fromColumnIndex = Number(colIndex)
  let toColumnIndex = Number(colIndex)
  let movedCards = new Set([$this])
  let prevTouch
  const startStamp = Date.now()
  const holdToDrag = 150 // milliseconds hold to drag card-task

  const setBgTimeoutId = win.setTimeout(() => {
    // theme ==> 0 = dark, 1 = light
    $this.style.backgroundColor = boardStore.theme === 0 ? '#23242c' : '#e2e8f0'
    isPreventMainScroll.value = true
  }, holdToDrag)

  const $mainScroll = doc.getElementById(`main-scroll`)
  const mainScrollMaxScrollRight = Math.floor($mainScroll.scrollWidth - $mainScroll.clientWidth)
  const mainScrollMaxScrollBottom = Math.floor($mainScroll.scrollHeight - $mainScroll.clientHeight)

  const setScrollIntervalId = win.setInterval(() => {
    // scroll when dragging out of frame
    const $thisRect = $this.getBoundingClientRect()
    const $thisMatrix = new DOMMatrix(win.getComputedStyle($this).transform)
    if ($thisRect.left < 0 && $mainScroll.scrollLeft > 0) {
      // scroll left
      // const leftDiff = Math.floor($thisRect.left / 10)
      // $this.style.transform = `translate(${Math.round(
      //   $thisMatrix.e + leftDiff
      // )}px, ${$thisMatrix.f}px)`
      // $mainScroll.scrollLeft = Math.round($mainScroll.scrollLeft + leftDiff)
      $this.style.transform = `translate(${Math.ceil($thisMatrix.e - 3)}px, ${$thisMatrix.f}px)`
      $mainScroll.scrollLeft = Math.ceil($mainScroll.scrollLeft - 3)
    }
    // const rightDiff = ($thisRect.right - win.innerWidth) / 10
    if ($thisRect.right > win.innerWidth && $mainScroll.scrollLeft < mainScrollMaxScrollRight) {
      // scroll right
      // $mainScroll.scrollLeft = Math.floor($mainScroll.scrollLeft + rightDiff)
      // $this.style.transform = `translate(${Math.floor(
      //   $thisMatrix.e + rightDiff
      // )}px, ${$thisMatrix.f}px)`

      $this.style.transform = `translate(${Math.floor($thisMatrix.e + 3)}px, ${$thisMatrix.f}px)`
      $mainScroll.scrollLeft = Math.ceil($mainScroll.scrollLeft + 3)
    }

    if ($thisRect.bottom > win.innerHeight && $mainScroll.scrollTop < mainScrollMaxScrollBottom) {
      // Scroll bottom
      $this.style.transform = `translate(${$thisMatrix.e}px, ${Math.ceil($thisMatrix.f + 3)}px)`
      $mainScroll.scrollTop = Math.ceil($mainScroll.scrollTop + 3)
    }

    if ($thisRect.top < $mainScroll.getBoundingClientRect().top && $mainScroll.scrollTop > 0) {
      $this.style.transform = `translate(${$thisMatrix.e}px, ${Math.ceil($thisMatrix.f - 3)}px)`
      $mainScroll.scrollTop = Math.ceil($mainScroll.scrollTop - 3)
    }
  }, 5)

  // mobile drag feature
  const touchMove = (e) => {
    e.stopImmediatePropagation()
    // e.preventDefault();

    console.log('touchMove e', e);
    
    if (!isDragged) {
      if (Date.now() - startStamp > holdToDrag) {
        isDragged = true
      } else {
        doc.removeEventListener('touchmove', touchMove)
        doc.removeEventListener('touchend', touchEnd)
        win.clearTimeout(setBgTimeoutId)
        win.clearInterval(setScrollIntervalId)
        $shadowRect.remove()
      }
    }
    if (isDragged) {
      const touch = e.touches[0]

      if (prevTouch) {
        e.movementX = touch.pageX - prevTouch.pageX
        e.movementY = touch.pageY - prevTouch.pageY

        // drag $this card-task
        const matrix = new DOMMatrix(win.getComputedStyle($this).transform)
        $this.style.transform = `translate(${matrix.e + e.movementX}px, ${
          matrix.f + e.movementY
        }px)`
      }
      prevTouch = touch
      e.clientX = touch.clientX
      e.clientY = touch.clientY
      // Drag and sort/swap lies here!! [START]
      if (isOut == false) {
        const $wrapperRect = $wrapper.getBoundingClientRect()

        if (
          e.clientX > $wrapperRect.right ||
          e.clientX < $wrapperRect.left ||
          e.clientY < $wrapperRect.top ||
          e.clientY > $wrapperRect.bottom
        ) {
          Array.from($wrapper.children).forEach(($el) => {
            if (Number($el.dataset.index) <= Number($this.dataset.index)) return

            $el.dataset.index = Number($el.dataset.index) - 1

            const destinationY =
              Number($el.dataset.destinationY) - (marginBottom + $thisRect.height)
            $el.style.transform = `translate(0px, ${destinationY}px)`
            $el.dataset.destinationY = destinationY

            movedCards.add($el)
          })

          const $temp = $wrapper
          $temp.dataset.isAnimating = 1
          win.setTimeout(() => {
            $temp.dataset.isAnimating = 0
          }, transitionDuration)

          $shadowRect.remove()
          isOut = true
          $wrapper = null
        }

        const $swapCards = doc.elementsFromPoint(e.clientX, e.clientY).filter(($el) => {
          if ($el === $this) return false
          return $el.classList.contains('card-task')
        })
        if (!!$swapCards.length && !!$swapCards[0].getAnimations().length == false) {
          const $swapCard = $swapCards[0]
          if (Number($this.dataset.index) < Number($swapCard.dataset.index) && e.movementY > 0) {

            const min = Math.min(Number($this.dataset.index), Number($swapCard.dataset.index))
            const max = Math.max(Number($this.dataset.index), Number($swapCard.dataset.index))
            Array.from($wrapper.children).forEach(($el) => {
              if (
                $el === $this ||
                Number($el.dataset.index) > max ||
                Number($el.dataset.index) < min
              )
                return
              $this.dataset.index = Number($this.dataset.index) + 1
              $el.dataset.index = Number($el.dataset.index) - 1

              $shadowRect.style.top = `${$el.getBoundingClientRect().bottom - $thisRect.height}px`
              $shadowRect.style.left = `${$el.getBoundingClientRect().left}px`

              const destinationY =
                Number($el.dataset.destinationY) - (marginBottom + $thisRect.height)
              $el.style.transform = `translate(0px, ${destinationY}px)`
              $el.dataset.destinationY = destinationY

              movedCards.add($el)
            })
          } else if (
            Number($this.dataset.index) > Number($swapCard.dataset.index) &&
            e.movementY < 0
          ) {

            const min = Math.min(Number($this.dataset.index), Number($swapCard.dataset.index))
            const max = Math.max(Number($this.dataset.index), Number($swapCard.dataset.index))
            let isFirst = false
            Array.from($wrapper.children).forEach(($el) => {
              if (
                $el === $this ||
                Number($el.dataset.index) > max ||
                Number($el.dataset.index) < min
              )
                return

              // swap vertical fix $shadowRect

              $this.dataset.index = Number($this.dataset.index) - 1
              $el.dataset.index = Number($el.dataset.index) + 1

              if (isFirst == false) {
                $shadowRect.style.top = `${$el.getBoundingClientRect().top}px`
                $shadowRect.style.left = `${$el.getBoundingClientRect().left}px`
                isFirst = true
              }

              const destinationY =
                Number($el.dataset.destinationY) + (marginBottom + $thisRect.height)
              $el.style.transform = `translate(0px, ${destinationY}px)`
              $el.dataset.destinationY = destinationY

              movedCards.add($el)
            })
          }
        }
        return
      } // INSIDE

      if (isOut) {
        const $neoWrapper = doc.elementsFromPoint(e.clientX, e.clientY).find(($el) => {
          return $el.classList.contains('task-wrapper')
        })

        if (!!$neoWrapper && $neoWrapper.childElementCount === 0) {
          $wrapper = $neoWrapper
          isOut = false
          $shadowRect.style.top = `${$wrapper.getBoundingClientRect().top}px`
          $shadowRect.style.left = `${$wrapper.getBoundingClientRect().left}px`
          doc.body.appendChild($shadowRect)

          $this.dataset.index = 0
          toColumnIndex = Number($wrapper.dataset.columnIndex)
          return
        }

        if (!!$neoWrapper && Number($neoWrapper.dataset.isAnimating) == 0) {

          toColumnIndex = Number($neoWrapper.dataset.columnIndex)
          $wrapper = $neoWrapper
          let isFirst = false
          let isMoved = false
          let $lastEl = null

          Array.from($wrapper.children).forEach(($el) => {
            if ($el === $this) return
            const $elRect = $el.getBoundingClientRect()
            // if (e.clientY <= $elRect.bottom && !!$el.getAnimations().length == false) {
            if (touch.clientY <= $elRect.bottom) {
              isOut = false
              isMoved = true
              if (isFirst == false) {
                isFirst = true
                const diff =
                  new DOMMatrix(win.getComputedStyle($el).transform).f -
                  Number($el.dataset.destinationY)
                $this.dataset.index = $el.dataset.index
                $shadowRect.style.top = `${$elRect.top - diff}px`
                $shadowRect.style.left = `${$elRect.left}px`
                doc.body.appendChild($shadowRect)
              }

              $el.dataset.index = Number($el.dataset.index) + 1

              const destinationY =
                Number($el.dataset.destinationY) + (marginBottom + $thisRect.height)
              $el.style.transform = `translate(0px, ${destinationY}px)`
              $el.dataset.destinationY = destinationY

              movedCards.add($el)
            }

            $lastEl = $el
          })


          if (isMoved == false) {
            // insert into last position in a new wrapper or when wrapper is empty of any card (new wrapper is initial wrapper)
            // $lastEl === null ? empty wrapper : last position;

            isOut = false
            isMoved = true
            $this.dataset.index = $lastEl === null ? 0 : Number($lastEl.dataset.index) + 1

            const $wrapperRect = $wrapper.getBoundingClientRect()
            $shadowRect.style.left = `${$wrapper.getBoundingClientRect().left}px`
            const top =
              $lastEl === null
                ? $wrapperRect.top - marginBottom
                : $lastEl.getBoundingClientRect().bottom +
                  Number($lastEl.dataset.destinationY) -
                  new DOMMatrix(win.getComputedStyle($lastEl).transform).f
            $shadowRect.style.top = `${top + marginBottom}px`
            doc.body.appendChild($shadowRect)
          }
        }
        return
      } // OUTSIDE

      // Drag and sort/swap lies here!! [END]
    }
  }

  const touchEnd = () => {

    $this.style.backgroundColor = ''
    win.clearTimeout(setBgTimeoutId)
    win.clearInterval(setScrollIntervalId)

    preventDrag.value = true
    win.setTimeout(() => {
      preventDrag.value = false
    }, transitionDuration)

    doc.removeEventListener('touchmove', touchMove)
    doc.removeEventListener('touchend', touchEnd)
    isPreventMainScroll.value = false

    // open modal task automatically handled by @click handler
    if (isDragged == false) {
      // open modal card
      boardStore.setColumnAndTaskIndex(colIndex, index)
      openModalTask.value = true
      boardStore.setColumnAndTaskIndex(fromColumnIndex, Number($this.dataset.index))
      $shadowRect.remove()
      return
    }

    $this.classList.add('card-task-transition')

    if ($wrapper == null) {
      // if outside of wrapper when cancelDrag
      movedCards.forEach(($el) => {
        if ($this === $el) return
        $el.style.transform = 'translate(0px, 0px)'
      })

      // reset cards.dataset.index
      Array.from($initialWrapper.children).reduce((curIndex, $el) => {
        if ($el === $this || Number($el.dataset.index) < fromIndex) return curIndex
        $el.dataset.index = curIndex + 1
        return curIndex + 1
      }, fromIndex)

      $shadowRect.style.top = `${$thisRect.top}px`
      $shadowRect.style.left = `${$thisRect.left}px`
      doc.body.appendChild($shadowRect)
    }

    // back to $shadowRect or back to initial position
    // New approach:
    const $toWrapper = $wrappers[isOut ? fromColumnIndex : toColumnIndex]
    $shadowRect.style.left = `${$toWrapper.getBoundingClientRect().left}px`

    const moveX = $this.getBoundingClientRect().x - $shadowRect.getBoundingClientRect().x
    const moveY = $this.getBoundingClientRect().y - $shadowRect.getBoundingClientRect().y
    const matrix = new DOMMatrix(win.getComputedStyle($this).transform)
    $this.style.transform = `translate(${matrix.e - moveX}px, ${matrix.f - moveY}px)`

    $this.classList.remove('z-50')
    $this.style.zIndex = ''

    $shadowRect.remove()

    // update store
    win.setTimeout(() => {
      // set translateY 0 to all moved cards
      const unsubscribe = boardStore.$onAction(({ name, after }) => {
        after(() => {
          // after swapTask
          if (name == 'swapTask') {
            movedCards.forEach(($c) => {
              $c.classList.remove('card-task-transition')
              $c.style.transform = 'translate(0px, 0px)'
              $c.dataset.destinationY = 0
              win.setTimeout(() => {
                $c.classList.add('card-task-transition')
                // console.log('add transition class')
              }, 100) // needed so no transition
            })

            if (isOut) $this.dataset.index = fromIndex
          }
        })
      })
      boardStore.swapTask(
        fromColumnIndex,
        isOut ? fromColumnIndex : toColumnIndex,
        fromIndex,
        isOut ? fromIndex : Number($this.dataset.index)
      )
      unsubscribe()
    }, transitionDuration) // this setTimeout needs for dragged card get back to the position using transition
  }
  doc.addEventListener('touchmove', touchMove)
  doc.addEventListener('touchend', touchEnd)
}

</script>

<template>
  <main
    :class="[
      'mobile:pl-0 pt-[96px] flex w-full h-[100vh] overflow-hidden transition-all',
      boardStore.sidebar ? 'pl-[300px]' : 'pl-[0px]'
    ]"
  >
    <div
      class="beautify-scrollbar w-[100vw] overflow-auto hover:cursor-col-resize"
      ref="refDragScroll"
      id="main-scroll"
      @mousedown="
        (e) => {
          dragScroll = true
          doc.body.classList.toggle('select-none')
          doc.addEventListener('mousemove', moveScrollHandler)
          doc.addEventListener('mouseup', removeScrollHandler)
        }
      "
      @touchmove="
        (e) => {
          if (isPreventMainScroll) e.preventDefault()
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

      <div
        class="relative flex w-full px-4 md:px-8 py-6"
        ref="boardFrameRef"
        id="column-wrapper"
      >
        <!-- Modal Task-->
        <Modal
          :open="openModalTask"
          @close-modal="
            () => {
              openModalTask = false
              openDropdownTask = false
            }
          "
          class="max-w-[480px] w-full p-8"
          :isFullscreen="isMobile"
        >
          <div class="relative mb-6">
            <div class="font-bold">{{ boardStore.task.title }}</div>
            <div class="absolute top-0 right-0">
              <button
                class="text-slate-400 p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-dark transition-colors hover:cursor-pointer"
                @click="openDropdownTask = true"
              >
                <IconEllipsis class="" />
              </button>
              <DropdownMenu
                left="left-1/2 -translate-x-1/2"
                editText="Edit Task"
                deleteText="Delete Task"
                :open="openDropdownTask"
                @on-click-edit="
                  () => {
                    openModalTask = false
                    openDropdownTask = false
                    openModalEditTask = true
                    console.log('active task', boardStore.task)
                  }
                "
                @on-click-delete="
                  () => {
                    openModalTask = false
                    openDropdownTask = false
                    openModalDeleteTask = true
                  }
                "
                @on-click-overlay="openDropdownTask = false"
              />
            </div>
          </div>
          <div class="text-xs font-semibold text-slate-400 mb-6">
            {{
              boardStore.task.description === '' ? 'No description.' : boardStore.task.description
            }}
          </div>
          <label class="block text-xs dark:text-white text-slate-400 font-bold mb-2"
            >Subtasks ({{
              boardStore.task.subtasks.reduce((acc, cv) => (cv.isDone ? acc + 1 : acc), 0)
            }}
            of {{ boardStore.task.subtasks.length }})</label
          >
          <div class="mb-4">
            <div class="text-xs font-semibold text-slate-400 mb-6">{{ boardStore.task.subtasks.length === 0 && 'No subtasks.' }}</div>
            <div
              v-for="(subtask, index) in boardStore.task.subtasks"
              :key="subtask.id"
              class="rounded dark:bg-dark bg-light-theme-bg hover:bg-[#A8A4FF50] dark:hover:bg-[#635fc740] transition-colors p-3 flex items-center hover:cursor-pointer mb-2"
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
                  'flex justify-center items-center w-[17px] h-[17px] border dark:border-slate-600 border-slate-300 rounded-sm mr-2',
                  subtask.isDone ? 'bg-primary' : 'dark:bg-dark-light bg-white'
                ]"
              >
                <IconCheck v-if="subtask.isDone" class="text-white w-[10px] h-[10px]" />
              </div>
              <div
                :class="['font-semibold text-xs', subtask.isDone && 'line-through text-gray-400']"
              >
                {{ subtask.text }}
              </div>
            </div>
          </div>

          <label class="block font-bold text-xs dark:text-white text-slate-400 mb-2"
            >Current Status</label
          >
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

        <!-- Modal Delete Task -->
        <Modal
          class="max-w-[480px] w-full p-8"
          :open="openModalDeleteTask"
          @close-modal="openModalDeleteTask = false"
          :isFullscreen="isMobile"
        >
          <div class="text-red-450 font-bold text-lg mb-4">Delete this Task?</div>
          <div class="text-[.8rem] text-slate-400 font-semibold leading-6 mb-6">
            Are you sure you want to delete the '{{ boardStore.task.title }}' task? This action will
            remove all columns and tasks and cannot be reversed.
          </div>
          <div class="flex justify-between">
            <Button
              @click="
                () => {
                  boardStore.deleteTask(this.activeColumnIndex, this.activeTaskIndex)
                  openModalDeleteTask = false
                  boardStore.$persist() // because if deletes the last item, I don't know why the store is not persisted.
                }
              "
              size="small"
              class="w-full mr-2"
              background-color="bg-red-450 transition-opacity hover:opacity-70"
              color="text-white"
              >Delete</Button
            >
            <Button
              @click="
                () => {
                  openModalDeleteTask = false
                  deleteColumnIndex = null
                  deleteTaskIndex = null
                }
              "
              size="small"
              class="w-full ml-2"
              background-color="bg-indigo-50 transition-opacity hover:opacity-70"
              color="text-primary"
              >Cancel</Button
            >
          </div>
        </Modal>
        <!-- Modal Delete Task-->

        <!-- Modal Edit Task -->
        <Modal
          :open="openModalEditTask"
          @close-modal="openModalEditTask = false"
          class="max-w-[480px] w-full p-8"
          :isFullscreen="isMobile"
        >
          <Form
            @submit="
              (values) => {
                boardStore.editTask(values)
                openModalEditTask = false
              }
            "
            :validation-schema="
              yup.object().shape({
                title: yup.string().required('Required'),
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
              title: boardStore.task.title,
              description: boardStore.task.description,
              subtasks: boardStore.task.subtasks,
              status: boardStore.task.status
            }"
          >
            <div class="text-lg font-bold mb-6">Edit Task</div>
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
                @click="() => {
                  push({ id: uuid(), text: '', isDone: false })
                  win.setTimeout(() => {
                    doc.getElementById(`subtasks[${fields.length - 1}].text`).focus();
                  },1);
                }"
                type="button"
                class="block w-full mb-4"
                size="small"
                background-color="bg-indigo-50 hover:text-primary-hover dark:bg-slate-50 dark:hover:bg-gray-200"
                color="text-primary"
                >+ Add New Subtask</Button
              >
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
              <Button type="submit" size="small" class="w-full">Save Changes</Button>
            </div>
          </Form>
        </Modal>
        <!-- Modal Edit Task -->

        <div
          v-for="(c, colIndex) in boardStore.board.columns"
          :key="c.id"
          class="column shrink-0 w-[286px] mr-8 flex flex-col"
        >
          <div class="flex items-center mb-6">
            <div :class="['w-[14px] h-[14px] rounded-full mr-3', `bg-dot${colIndex}`]"></div>
            <div class="uppercase font-semibold tracking-[3px] text-xs text-slate-400">
              {{ c.name }}({{ c.tasks.length }})
            </div>
          </div>

          <!-- card (tasks) -->
          <div
            ref="tasksWrapperRefs"
            :data-column-index="colIndex"
            data-is-animating="0"
            class="task-wrapper pb-8"
            :class="
              c.tasks.length > 0
                ? 'flex flex-col h-full'
                : 'h-[calc(100vh_-_232px)] border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg'
            "
          >
            <div
              v-for="(t, index) in c.tasks"
              class="card-task card-task-transition bg-white text-black dark:bg-dark-light dark:text-white rounded-lg dark:border dark:border-gray-750 shadow-md shadow-slate-200 dark:shadow-none hover:cursor-grab select-none px-4 py-6 mb-4 relative"
              :key="t.id"
              data-moveable="0"
              :data-index="index"
              :data-y="0"
              :data-title="t.title"
              :data-is-animating="0"
              data-destination-y="0"
              @touchstart="dragMobile({ colIndex, index }, $event)"
              @mousedown="dragDesktop({ colIndex, index }, $event)"
            >
              <div class="font-bold text-[15px] mb-3">{{ t.title }}</div>
              <div class="text-xs text-slate-400 font-semibold">
                {{ t.subtasks.filter((st) => st.isDone).length }} of
                {{ t.subtasks.length }} subtasks
              </div>
            </div>
          </div>
        </div>

        <div class="shrink-0 w-[286px] flex flex-col">
          <div class="h-[44px]"></div>
          <div
            class="h-[calc(100vh_-_232px)] bg-gradient-to-b dark:from-dark-light dark:to-dark from-slate-200 to-light-theme-bg text-slate-400 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:cursor-pointer rounded-lg transition-all flex items-center justify-center font-bold text-2xl"
            @click="
              (e) => {
                openModalNewColumn = true;
                win.setTimeout(() => {
                  doc.getElementById('columns[0].name')?.focus()
                });
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
            class="max-w-[480px] w-full p-8"
            :isFullscreen="isMobile ? true : false"
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
                <button @click="() => {
                  console.log('hehehe')
                  for (let i = 0; i < 4; i++) {
                    console.log('i', i);
                  }
                }" type="button">For loop</button>
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
                    @click="() => {
                      push({ name: '', tasks: [] })
                      win.setTimeout(() => {
                        doc.getElementById(`columns[${fields.length - 1}].name`).focus()
                      },1)
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
        <div class="shrink-0 w-[100px]"></div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.card-task-transition {
  transition: transform cubic-bezier(0.32, 0.82, 0.4, 0.99) 200ms;
}
</style>
