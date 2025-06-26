import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import TodoApp from '@/pages/index.vue'
import { initUseFetchMock, useFetchMock } from '~/tests/setup'

describe('@/pages/index.vue', () => {
  beforeEach(() => {
    useFetchMock.mockReset()
    initUseFetchMock()
  })

  it('displays loading state when pending', () => {
    initUseFetchMock({ pending: ref(true) })
    const wrapper = mount(TodoApp)
    expect(wrapper.text()).toContain('Loading todos...')
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('displays error message when fetch fails', () => {
    initUseFetchMock({ error: ref({ message: 'Failed to fetch todos' }) })
    const wrapper = mount(TodoApp)
    expect(wrapper.text()).toContain('Failed to fetch todos')
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('displays todo list', () => {
    initUseFetchMock({
      data: ref([
        { id: 1, title: 'Learn Vue.js 3', completed: false },
        { id: 2, title: 'Build a Vue.js app', completed: false }
      ])
    })
    const wrapper = mount(TodoApp)
    const todoItems = wrapper.findAll('[data-test="todo-item"]')
    expect(todoItems).toHaveLength(2)
    expect(todoItems[0].text()).toBe('Learn Vue.js 3')
    expect(todoItems[1].text()).toBe('Build a Vue.js app')
    expect(wrapper.find('[data-test="no-todos"]').exists()).toBe(false)
  })

  it('displays "No todos yet!" when todos is empty', () => {
    initUseFetchMock()
    const wrapper = mount(TodoApp)
    expect(wrapper.find('[data-test="no-todos"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-test="todo-item"]').length).toBe(0)
  })

  it('adds a new todo successfully', async () => {
    initUseFetchMock()
    const wrapper = mount(TodoApp)
    const input = wrapper.find('[data-test="todo-input"]')
    await input.setValue('New Todo')
    await input.trigger('keyup.enter')
    const todoItems = wrapper.findAll('[data-test="todo-item"]')
    expect(todoItems).toHaveLength(1)
    expect(todoItems[0].text()).toBe('New Todo')
    expect((input.element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('[data-test="add-error"]').exists()).toBe(false)
  })

  it('shows error when adding empty todo', async () => {
    initUseFetchMock()
    const wrapper = mount(TodoApp)
    const input = wrapper.find('[data-test="todo-input"]')
    await input.setValue('')
    await input.trigger('keyup.enter')
    expect(wrapper.find('[data-test="add-error"]').text()).toBe('Todo cannot be empty')
    expect(wrapper.findAll('[data-test="todo-item"]').length).toBe(0)
  })

  it('shows error when adding duplicate todo', async () => {
    initUseFetchMock({
      data: ref([
        { id: 1, title: 'Existing Todo', completed: false }
      ])
    })
    const wrapper = mount(TodoApp)
    const input = wrapper.find('[data-test="todo-input"]')
    await input.setValue('Existing Todo')
    await input.trigger('keyup.enter')
    expect(wrapper.find('[data-test="add-error"]').text()).toBe('Todo already exists')
    expect(wrapper.findAll('[data-test="todo-item"]').length).toBe(1)
  })
})
