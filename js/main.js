Vue.component('task-form', {
    data() {
        return {
            title: '', // Заголовок задачи
            description: '', // Описание задачи
            deadline: '', // Дедлайн задачи
        };
    },
    computed: {
        canAddTask() {
            // Проверка, можно ли отправить форму (например, если есть заголовок, описание и дедлайн)
            return this.title && this.description && this.deadline;
        }
    },
    methods: {
        submitTask() {
            // Создаем новый объект задачи
            const newTask = {
                title: this.title,
                description: this.description,
                deadline: this.deadline,
                status: 'unfinished' // Статус задачи по умолчанию
            };

            // Эмитируем событие для родительского компонента с новой задачей
            this.$emit('add-task', newTask);

            // Очищаем форму
            this.resetForm();
        },
        resetForm() {
            // Сбрасываем поля формы
            this.title = '';
            this.description = '';
            this.deadline = '';
        }
    },
    template: `
        <div class="task-form">
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
        }
    },
    template: `
        <div id="app">
            <!-- Заголовок Канбан доски -->
            <h1 style="text-align: center; color: #333; font-size: 2.5em;">Kanban доска</h1>

            <!-- Компонент для создания задачи -->
            <div class="task-form">
                <task-form @add-task="addTask"></task-form>
            </div>

            <!-- Список задач -->
            <div v-if="tasks.length" class="task-list">
                <h2>Список задач</h2>
                <ul>
                    <li v-for="(task, index) in tasks" :key="index" class="task-item">
                        <strong>{{ task.title }}</strong>
                        <p>{{ task.description }}</p>
                        <p><em>Дедлайн: {{ task.deadline }}</em></p>
                        <p>Status: <span :class="task.status === 'unfinished' ? 'unfinished task-status' : 'finished task-status'">{{ task.status }}</span></p>
                    </li>
                </ul>
            </div>

            <!-- Сообщение, если задач нет -->
            <div v-else>
                <p style="text-align: center; color: #888;">Нет задач!</p>
            </div>
        </div>
    `
});
