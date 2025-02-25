Vue.component('task-form', {
    data() {
        return {
            title: '',
            description: '',
            deadline: ''
        };
    },
    computed: {
        canAddTask() {
            return this.title && this.description && this.deadline;
        }
    },
    methods: {
        submitTask() {
            const newTask = {
                title: this.title,
                description: this.description,
                deadline: this.deadline,
                status: 'unfinished',
                lastEdited: new Date().toISOString() // Временной штамп последнего редактирования
            };

            // Эмитируем добавление задачи
            this.$emit('add-task', newTask);
            this.resetForm();
        },
        resetForm() {
            this.title = '';
            this.description = '';
            this.deadline = '';
        }
    },
    template: `
  <div>
    <form @submit.prevent="submitTask">
      <div>
        <label for="title">Заголовок</label>
        <input type="text" id="title" v-model="title" required />
      </div>

      <div>
        <label for="description">Описание</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>

      <div>
        <label for="deadline">Дедлайн</label>
        <input type="date" id="deadline" v-model="deadline" required />
      </div>

      <button type="submit" :disabled="!canAddTask">Создать задачу</button>
    </form>
  </div>
  `
});




Vue.component('task-column', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    methods: {
        deleteTask(index) {
            this.$emit('delete-task', index); // Эмитируем удаление задачи
        },
        updateTask({ index, updatedTask }) {
            this.$emit('update-task', { index, updatedTask }); // Эмитируем обновление задачи
        }
    },
    template: `
    <div>
      <h2>Запланированные задачи</h2>
      <ul>
        <li v-for="(task, index) in tasks.filter(task => task.status === 'unfinished')" :key="index">
          <task-item
            :task="task"
            :index="index"
            @delete-task="deleteTask"
            @update-task="updateTask"
          />
        </li>
      </ul>

      <h2>Задачи в работе</h2>
      <ul>
        <li v-for="(task, index) in tasks.filter(task => task.status === 'inProgress')" :key="index">
          <task-item
            :task="task"
            :index="index"
            @delete-task="deleteTask"
            @update-task="updateTask"
          />
        </li>
      </ul>

      <h2>Задачи в тестировании</h2>
      <ul>
        <li v-for="(task, index) in tasks.filter(task => task.status === 'testing')" :key="index">
          <task-item
            :task="task"
            :index="index"
            @delete-task="deleteTask"
            @update-task="updateTask"
          />
        </li>
      </ul>

      <h2>Выполненные задачи</h2> <!-- Новый столбец для выполненных задач -->
      <ul>
        <li v-for="(task, index) in tasks.filter(task => task.status === 'finished')" :key="index">
          <task-item
            :task="task"
            :index="index"
            @delete-task="deleteTask"
            @update-task="updateTask"
          />
        </li>
      </ul>
    </div>
  `
});


Vue.component('task-item', {
    props: {
        task: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            editing: false, // Флаг редактирования
            editedTitle: this.task.title,
            editedDescription: this.task.description,
            editedDeadline: this.task.deadline,
            returnReason: '' // Причина возврата
        };
    },
    methods: {
        deleteTask() {
            if (this.task.status === 'unfinished') { // Проверяем, что задача в статусе "Запланированная"
                this.$emit('delete-task', this.index); // Эмитируем удаление задачи
            } else {
                alert('Задачу можно удалить только в статусе "Запланированная"');
            }
        },
        editTask() {
            this.editing = true; // Включаем режим редактирования
        },
        saveTask() {
            const updatedTask = {
                ...this.task,
                title: this.editedTitle,
                description: this.editedDescription,
                deadline: this.editedDeadline,
                lastEdited: new Date().toISOString() // Обновляем временной штамп
            };
            this.$emit('update-task', { index: this.index, updatedTask });
            this.editing = false; // Выходим из режима редактирования
        },
        moveToInProgress() {
            const updatedTask = { ...this.task, status: 'inProgress' };
            this.$emit('update-task', { index: this.index, updatedTask });
        },
        moveToTesting() {
            const updatedTask = { ...this.task, status: 'testing' };
            this.$emit('update-task', { index: this.index, updatedTask });
        },
        returnToInProgress() {
            if (this.returnReason) {
                const updatedTask = {
                    ...this.task,
                    status: 'inProgress',
                    returnReason: this.returnReason // Указываем причину возврата
                };
                this.$emit('update-task', { index: this.index, updatedTask });
                this.returnReason = ''; // Сбрасываем причину после отправки
            } else {
                alert('Укажите причину возврата');
            }
        },
        moveToFinished() { // Новый метод для перемещения в статус "finished"
            const updatedTask = { ...this.task, status: 'finished' };
            this.$emit('update-task', { index: this.index, updatedTask });
        }
    },
    template: `
    <div>
      <div v-if="editing">
        <!-- Форма для редактирования задачи -->
        <div>
          <label for="title">Заголовок</label>
          <input type="text" id="title" v-model="editedTitle" required />
        </div>
        <div>
          <label for="description">Описание</label>
          <textarea id="description" v-model="editedDescription" required></textarea>
        </div>
        <div>
          <label for="deadline">Дедлайн</label>
          <input type="date" id="deadline" v-model="editedDeadline" required />
        </div>
        <button @click="saveTask">Сохранить</button>
      </div>
      <div v-else>
        <!-- Отображение задачи -->
        <strong>{{ task.title }}</strong>
        <p>{{ task.description }}</p>
        <p><em>Дедлайн: {{ task.deadline }}</em></p>
        <p>Status: {{ task.status }}</p>
        <p v-if="task.lastEdited">Последнее редактирование: {{ task.lastEdited }}</p>
        <p v-if="task.returnReason">Причина возврата: {{ task.returnReason }}</p> <!-- Отображение причины возврата -->
        <button @click="editTask">Редактировать</button>
        <button v-if="task.status === 'unfinished'" @click="deleteTask">Удалить</button> <!-- Удаление только в статусе "unfinished" -->
        <button v-if="task.status === 'unfinished'" @click="moveToInProgress">Далее</button>
        <button v-if="task.status === 'inProgress'" @click="moveToTesting">Тестирование</button>
        <div v-if="task.status === 'testing'">
          <label for="returnReason">Причина возврата:</label>
          <textarea id="returnReason" v-model="returnReason" required></textarea>
          <button @click="returnToInProgress">Вернуть в работу</button>
          <!-- Кнопка для перемещения в статус "finished" -->
          <button @click="moveToFinished">Завершить</button>
        </div>
      </div>
    </div>
  `
});





new Vue({
    el: '#app',
    data() {
        return {
            tasks: [] // Массив для хранения задач
        };
    },
    methods: {
        addTask(newTask) {
            // Добавляем новую задачу в массив
            this.tasks.push(newTask);
        },
        deleteTask(index) {
            // Удаляем задачу из массива
            this.tasks.splice(index, 1);
        },
        updateTask({ index, updatedTask }) {
            // Обновляем задачу в массиве
            this.tasks.splice(index, 1, updatedTask);
        }
    }
});
