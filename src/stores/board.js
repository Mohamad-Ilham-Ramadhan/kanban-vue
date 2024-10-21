import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'
import { toRaw } from 'vue'
export const useBoardStore = defineStore('board', {
   state: () => ({
      activeBoardIndex: 0, // active board index
      activeColumnIndex: 0, // for modal task
      activeTaskIndex: 0, // for modal task
      theme: 0, // 0 = dark, 1 = light
      sidebar: true, // true = show, false = hidden
      boards: [
         {
            id: uuid(),
            name: 'Platform Launch',
            columns: [
               {
                  id: uuid(),
                  name: 'Todo',
                  tasks: [
                     {
                        id: uuid(), title: 'Build UI for onboarding flow.', description: '', subtasks: [
                           { id: uuid(), text: 'Sign up page', isDone: true },
                           { id: uuid(), text: 'Sign in page', isDone: false },
                           { id: uuid(), text: 'Welcome page', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Build UI for search.', description: '', subtasks: [
                           { id: uuid(), text: 'Search page', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Build settings UI.', description: '', subtasks: [
                           { id: uuid(), text: 'Account page', isDone: false },
                           { id: uuid(), text: 'Billing page', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'QA and test all major user journeys.', description: 'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.', subtasks: [
                           { id: uuid(), text: 'Internal testing', isDone: false },
                           { id: uuid(), text: 'External testing', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                  ]
               },
               {
                  id: uuid(),
                  name: 'Doing',
                  tasks: [
                     {
                        id: uuid(), title: 'Design settings and search pages', description: '', subtasks: [
                           { id: uuid(), text: 'Settings - Accoung page', isDone: true },
                           { id: uuid(), text: 'Settings - Billing page', isDone: true },
                           { id: uuid(), text: 'Search page', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Add account management endpoints', description: '', subtasks: [
                           { id: uuid(), text: 'Upgrade plan', isDone: true },
                           { id: uuid(), text: 'Cancel plan', isDone: true },
                           { id: uuid(), text: 'Update payment method', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Design onboarding flow', description: '', subtasks: [
                           { id: uuid(), text: 'Sign up page', isDone: true },
                           { id: uuid(), text: 'Sign in page', isDone: false },
                           { id: uuid(), text: 'Welcome page', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Add search endpoints', description: '', subtasks: [
                           { id: uuid(), text: 'Add search endpoint', isDone: true },
                           { id: uuid(), text: 'Define search filters', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Add authentication endpoints', description: '', subtasks: [
                           { id: uuid(), text: 'Define user model', isDone: true },
                           { id: uuid(), text: 'Add auth endpoints', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Research pricing points of various competitors and trial different business models', description: "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.", subtasks: [
                           { id: uuid(), text: 'Research competitor pricing and business models', isDone: true },
                           { id: uuid(), text: 'Outline a business model that works for our solution', isDone: false },
                           { id: uuid(), text: 'Talk to potential customers about our proposed solution and a sk for fair price expectancy', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                  ]
               },
               {
                  id: uuid(),
                  name: 'Done',
                  tasks: [
                     {
                        id: uuid(), title: 'Conduct 5 wireframes tests', description: 'Ensure the layout continues to make sense and we have strong buy-in from potential users.', subtasks: [
                           { id: uuid(), text: 'Complete 5 wireframe prototype tests', isDone: true },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Create wireframe prototype', description: 'Create a greyscale clickable wireframe prototype to test our asssumptions so far.', subtasks: [
                           { id: uuid(), text: 'Create clickable wireframe prototype in Balsamiq', isDone: true },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Review result of usability tests and iterate', description: "Keep iterating through the subtasks until we're clear on the core concepts for the app.", subtasks: [
                           { id: uuid(), text: 'Meet to review notes from previous tests and plan changes', isDone: true },
                           { id: uuid(), text: 'Make changes to paper prototypes', isDone: true },
                           { id: uuid(), text: 'Conduct 5 usability tests', isDone: true },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Create paper prototypes and conduct 10 usability tests with potential customers', description: '', subtasks: [
                           { id: uuid(), text: 'Create paper prototypes for version one', isDone: true },
                           { id: uuid(), text: 'Complete 10 usability tests', isDone: true },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                  ]
               }


            ]
         },

         {
            id: uuid(),
            name: 'Marketing Plan',
            columns: [
               {
                  id: uuid(),
                  name: 'Todo',
                  tasks: [
                     {
                        id: uuid(), title: 'Plan Product Hunt launch', description: '', subtasks: [
                           { id: uuid(), text: 'Find hunter', isDone: false },
                           { id: uuid(), text: 'Gather assets', isDone: false },
                           { id: uuid(), text: 'Draft product page', isDone: false },
                           { id: uuid(), text: 'Notify customers', isDone: false },
                           { id: uuid(), text: 'Notify network', isDone: false },
                           { id: uuid(), text: 'Launch!', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Share on Show HN', description: '', subtasks: [
                           { id: uuid(), text: 'Draft out HN post', isDone: false },
                           { id: uuid(), text: 'Get feedback and refine', isDone: false },
                           { id: uuid(), text: 'Publish post', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                     {
                        id: uuid(), title: 'Write launch article to publish on multiple channels', description: '', subtasks: [
                           { id: uuid(), text: 'Write article', isDone: false },
                           { id: uuid(), text: 'Publish on LinkedIn', isDone: false },
                           { id: uuid(), text: 'Publish on Indie Hackers', isDone: false },
                           { id: uuid(), text: 'Publish on Medium', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                  ]
               },
               {
                  id: uuid(),
                  name: 'Doing',
                  tasks: []
               },
            ]
         },

         {
            id: uuid(),
            name: 'Roadmap',
            columns: [
               {
                  id: uuid(),
                  name: 'Now',
                  tasks: [
                     {
                        id: uuid(), title: 'Launch version one', description: '', subtasks: [
                           { id: uuid(), text: 'Launch privately to our waitlist', isDone: false },
                           { id: uuid(), text: 'Launch publicly on PH, HN, etc.', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                  ]
               },
               {
                  id: uuid(),
                  name: 'Next',
                  tasks: [
                     {
                        id: uuid(), title: 'Review early feedback and plan next steps for roadmap', description: "Beyond the initial launch, we're keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.", subtasks: [
                           { id: uuid(), text: 'Interview 10 customers', isDone: false },
                           { id: uuid(), text: 'Review common customer pain points and suggestions', isDone: false },
                           { id: uuid(), text: 'Outline next steps for our roadmap', isDone: false },
                        ], y: 0, pageYTop: 0, pageYBottom: 0, moved: ''
                     },
                  ]
               },
               {
                  id: uuid(),
                  name: 'Later',
                  tasks: []
               }
            ]
         },
         {
            id: uuid(),
            name: 'Coba',
            columns: [
               {
                  id: uuid(),
                  name: 'Todo',
                  tasks: [
                     {
                        id: uuid(),
                        title: '(1) 1',
                        description: 'asdf',
                        subtasks: []
                     },{
                        id: uuid(),
                        title: "(1) 2. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                        description: 'asdf',
                        subtasks: []
                     },{
                        id: uuid(),
                        title: '(1) 3',
                        description: 'asdf',
                        subtasks: []
                     },
                  ]
               },{
                  id: uuid(),
                  name: 'Doing',
                  tasks: [
                     {
                        id: uuid(),
                        title: '(2) 1',
                        description: 'asdf',
                        subtasks: []
                     },{
                        id: uuid(),
                        title: '(2) 2',
                        description: 'asdf',
                        subtasks: []
                     },{
                        id: uuid(),
                        title: '(2) 3',
                        description: 'asdf',
                        subtasks: []
                     },{
                        id: uuid(),
                        title: '(2) 4',
                        description: 'asdf',
                        subtasks: []
                     },{
                        id: uuid(),
                        title: '(2) 5',
                        description: 'asdf',
                        subtasks: []
                     },
                  ]
               },{
                  id: uuid(),
                  name: 'Finish',
                  tasks: [
                     {
                        id: uuid(),
                        title: '(3) 1',
                        description: 'asdf',
                        subtasks: []
                     },{
                        id: uuid(),
                        title: '(3) 2',
                        description: 'asdf',
                        subtasks: []
                     },{
                        id: uuid(),
                        title: '(3) 3',
                        description: 'asdf',
                        subtasks: []
                     },
                  ]
               },
            ]
         }
      ]
   }),
   getters: {
      board: (state) => state.boards[state.activeBoardIndex],
      boardsNameSet: (state) => {
         // for unique name validation on create new board
         const s = new Set();
         state.boards.forEach(b => {
            s.add(b.name.toLocaleLowerCase().trim())
         });
         return s;
      },
      task: (state) => state.boards[state.activeBoardIndex].columns[state.activeColumnIndex].tasks[state.activeTaskIndex],
      tasksTitleSet: (state) => {
         // current board set of tasks' title
         const s = new Set();
         state.boards[state.activeBoardIndex].columns.forEach( column => {
           column.tasks.forEach( task => {
             s.add(task.title.toLowerCase().trim())
           })
         });
         return s;
      }
   },
   actions: {
      setTheme(value) {
         this.theme = value;
      },
      setSidebar() {
         this.sidebar = !this.sidebar;
      },
      setActiveBoardIndex(index) {
         this.activeBoardIndex = index
      },
      createNewBoard({name, columns}) {
         const newBoard = {
            id: uuid(),
            name: name.trim(),
            columns: columns.map( c => ({id: uuid(), name: c.trim(), tasks: []}))
         }
         this.boards.push(newBoard)
      },
      deleteActiveBoard() {
         this.boards.splice(this.activeBoardIndex, 1)
         this.activeBoardIndex = 0
      },
      addNewcolumn(columns) {
         this.board.columns = columns.map( c => {
            if (c.id === undefined) {
               c.id = uuid()
            }
            return c
         })
      },
      setName(name) {
         this.board.name = name
      },
      addNewTask(task) {
         this.boards[this.activeBoardIndex].columns[task.status.index].tasks.push({
            id: uuid(),
            title: task.title,
            description: task.description,
            subtasks: task.subtasks, 
         })
      },
      swapTask(fromColumnIndex, toColumnIndex, fromIndex, toIndex) { // drag/sort card task
         // this.board.columns[colIndex].tasks
         if (toColumnIndex === null && fromIndex === toIndex) {
            return;
         } else if (fromColumnIndex === toColumnIndex || toColumnIndex === null) {

            if (toIndex > fromIndex) { // drag ke bawah

               // re-arrange tasks in the current column
               const newTasks = this.board.columns[fromColumnIndex].tasks.map((t, index) => {
                  if (index > toIndex || index < fromIndex) return t
                  if (index == toIndex) return this.board.columns[fromColumnIndex].tasks[fromIndex] 
                  if (index >= fromIndex) return this.board.columns[fromColumnIndex].tasks[index + 1]
               })
               this.boards[this.activeBoardIndex].columns[fromColumnIndex].tasks = newTasks;
            } else if (toIndex < fromIndex) { // drag ke atas
               
               // re-arrange tasks in the current column
               const newTasks = this.board.columns[fromColumnIndex].tasks.map((t, index) => {
                  if (index < toIndex || index > fromIndex) return t
                  if (index == toIndex) return this.board.columns[fromColumnIndex].tasks[fromIndex] 
                  if (index <= fromIndex) return this.board.columns[fromColumnIndex].tasks[index - 1]
               })
               this.boards[this.activeBoardIndex].columns[fromColumnIndex].tasks = newTasks
            }
         } else {
            // oldColumn
            const theTask = this.board.columns[fromColumnIndex].tasks.splice(fromIndex, 1)[0];
            this.board.columns[toColumnIndex].tasks.splice(toIndex, 0, theTask)
         }
      },
      editTask(values) {
         this.board.columns[values.status.index].tasks[this.activeTaskIndex].title = values.title; 
         this.board.columns[values.status.index].tasks[this.activeTaskIndex].description = values.description; 
         this.board.columns[values.status.index].tasks[this.activeTaskIndex].subtasks = values.subtasks; 
         if (this.activeColumnIndex !== values.status.index) {
            const newTask = this.board.columns[this.activeColumnIndex].tasks.splice(this.activeTaskIndex, 1)
            this.baord.columns[values.status.index].tasks.push(newTask)
         }
      },
      deleteTask() {
         this.boards[this.activeBoardIndex].columns[this.activeColumnIndex].tasks.splice(this.activeTaskIndex, 1)
         // this.boards[this.activeBoardIndex].columns[this.activeColumnIndex].tasks = this.boards[this.activeBoardIndex].columns[this.activeColumnIndex].tasks.filter((t,id) => id !== this.activeTaskIndex )
      },
      toggleSubtask(columnIndex, taskIndex, subtaskIndex) {
         this.board.columns[columnIndex].tasks[taskIndex].subtasks[subtaskIndex].isDone = !this.board.columns[columnIndex].tasks[taskIndex].subtasks[subtaskIndex].isDone
      },
      changeTaskColumn(fromColumnIndex, toColumnIndex, taskIndex) {

         const theTask = this.board.columns[fromColumnIndex].tasks.splice(taskIndex, 1)
         this.board.columns[toColumnIndex].tasks.push(toRaw(theTask[0]))
         this.activeColumnIndex = toColumnIndex
         this.activeTaskIndex = this.board.columns[toColumnIndex].tasks.length - 1
      },
      setColumnAndTaskIndex(columnIndex, taskIndex) {
         this.activeColumnIndex = columnIndex
         this.activeTaskIndex = taskIndex
      }
   },
   persist: {
      key: 'kanban'
   }
})