<script setup>
const { $apis } = useNuxtApp()
const newTodo = ref('')
const addError = ref('')

const {
  data: todos,
  error,
  pending
} = useAsyncData('todos', async () => {
  try {
    const response = await $apis.test('todos').json()
    return response
  } catch (err) {
    throw err
  }
})

const addTodo = async () => {
  const text = newTodo.value.trim()
  if (!text) {
    addError.value = 'Todo cannot be empty'
    return
  }
  if (todos.value.some(todo => todo.title === text)) {
    addError.value = 'Todo already exists'
    return
  }

  try {
    const response = await $apis.test
      .post('todos', {
        json: { title: text, completed: false }
      })
      .json()
    todos.value.push(response)
    newTodo.value = ''
    addError.value = ''
  } catch (error) {
    console.error('Error adding todo:', error)
    addError.value = 'Failed to add todo'
  }
}
</script>

<template>
  <div>
    <h1>Todo List</h1>
    <div v-if="pending">Loading todos...</div>
    <p v-else-if="error">{{ error.message }}</p>
    <div v-else>
      <input
        v-model="newTodo"
        placeholder="Add a new todo"
        data-test="todo-input"
        @keyup.enter="addTodo"
      />
      <p
        v-if="addError"
        data-test="add-error"
      >
        {{ addError }}
      </p>
      <ul>
        <li
          v-for="todo in todos"
          :key="todo.id"
          data-test="todo-item"
        >
          {{ todo.title }}
        </li>
      </ul>
      <p
        v-if="!todos.length"
        data-test="no-todos"
      >
        No todos yet!
      </p>
    </div>
  </div>
</template>
