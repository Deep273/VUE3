// Компонент для создания новой задачи
Vue.component('task-creator', {
    data() {
        return {
            taskTitle: '',
            taskDescription: '',
            taskDeadline: ''
        };
    },
    computed: {
        canSubmit() {
            return this.taskTitle && this.taskDescription && this.taskDeadline;
        }
    },
    methods: {
        createTask() {
            const newTask = {
                title: this.taskTitle,
                description: this.taskDescription,
                deadline: this.taskDeadline,
                status: 'not-started',
                lastUpdated: new Date().toISOString()
            };

            this.$emit('add-task', newTask);
            this.clearForm();
        },
        clearForm() {
            this.taskTitle = '';
            this.taskDescription = '';
            this.taskDeadline = '';
        }
    },
    template: `
    <form @submit.prevent="createTask">
        <div>
            <label for="task-title">Заголовок:</label>
            <input type="text" v-model="taskTitle" id="task-title" required />
        </div>
        <div>
            <label for="task-description">Описание:</label>
            <textarea v-model="taskDescription" id="task-description" required></textarea>
        </div>
        <div>
            <label for="task-deadline">Дедлайн:</label>
            <input type="date" v-model="taskDeadline" id="task-deadline" required />
        </div>
        <button type="submit" :disabled="!canSubmit">Добавить задачу</button>
    </form>
    `
});

// Компонент для отображения задач и их управления
Vue.component('task-board', {
    props: {
        tasks: Array
    },
    data() {
        return {
            currentEditIndex: null,
            editTitle: '',
            editDescription: '',
            editDeadline: ''
        };
    },
    methods: {
        removeTask(index) {
            this.$emit('remove-task', index);
        },
        startEditing(index) {
            const task = this.tasks[index];
            this.currentEditIndex = index;
            this.editTitle = task.title;
            this.editDescription = task.description;
            this.editDeadline = task.deadline;
        },
        saveEditedTask() {
            const updatedTask = {
                title: this.editTitle,
                description: this.editDescription,
                deadline: this.editDeadline,
                status: this.tasks[this.currentEditIndex].status,
                lastUpdated: new Date().toISOString()
            };
            this.$emit('edit-task', { index: this.currentEditIndex, updatedTask });
            this.currentEditIndex = null;
        },
        moveTaskToProgress(index) {
            const task = this.tasks[index];
            task.status = 'in-progress';
            this.$emit('progress-task', { index, updatedTask: task });
        }
    },
    template: `
    <div>
        <!-- Задачи на начальной стадии -->
        <h2>Не начатые задачи</h2>
        <ul>
            <li v-for="(task, index) in tasks.filter(task => task.status === 'not-started')" :key="index">
                <div v-if="currentEditIndex === index">
                    <div>
                        <label for="edit-title">Заголовок</label>
                        <input type="text" v-model="editTitle" id="edit-title" required />
                    </div>
                    <div>
                        <label for="edit-description">Описание</label>
                        <textarea v-model="editDescription" id="edit-description" required></textarea>
                    </div>
                    <div>
                        <label for="edit-deadline">Дедлайн</label>
                        <input type="date" v-model="editDeadline" id="edit-deadline" required />
                    </div>
                    <button @click="saveEditedTask">Сохранить изменения</button>
                </div>
                <div v-else>
                    <strong>{{ task.title }}</strong>
                    <p>{{ task.description }}</p>
                    <p><em>Дедлайн: {{ task.deadline }}</em></p>
                    <p>Status: {{ task.status }}</p>
                    <p v-if="task.lastUpdated">Последнее редактирование: {{ task.lastUpdated }}</p>
                    <button @click="startEditing(index)">Редактировать</button>
                    <button @click="removeTask(index)">Удалить</button>
                    <button @click="moveTaskToProgress(index)">Переместить в работу</button>
                </div>
            </li>
        </ul>

        <!-- Задачи в процессе -->
        <h2>Задачи в процессе</h2>
        <ul>
            <li v-for="(task, index) in tasks.filter(task => task.status === 'in-progress')" :key="index">
                <strong>{{ task.title }}</strong>
                <p>{{ task.description }}</p>
                <p><em>Дедлайн: {{ task.deadline }}</em></p>
                <p>Status: {{ task.status }}</p>
                <p v-if="task.lastUpdated">Последнее редактирование: {{ task.lastUpdated }}</p>
                <button @click="startEditing(index)">Редактировать</button>
                <button @click="removeTask(index)">Удалить</button>
            </li>
        </ul>
    </div>
    `
});

// Основной экземпляр Vue
new Vue({
    el: '#kanbanApp',
    data() {
        return {
            tasks: [] // Массив задач
        };
    },
    methods: {
        addTask(newTask) {
            this.tasks.push(newTask);
        },
        removeTask(index) {
            this.tasks.splice(index, 1);
        },
        editTask({ index, updatedTask }) {
            this.tasks.splice(index, 1, updatedTask);
        },
        moveTaskToProgress({ index, updatedTask }) {
            this.tasks.splice(index, 1, updatedTask);
        }
    }
});
