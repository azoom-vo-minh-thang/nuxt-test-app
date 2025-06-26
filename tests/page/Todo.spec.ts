import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import TodoPage from '@/pages/Todo.vue'
import {
  initUseAsyncDataMock,
  useLazyAsyncDataMock,
  kyPostMock,
  kyJsonMock,
  mockKyInstance
} from '~/tests/setup'

type Todo = { id: number; title: string; completed: boolean }

describe('@/pages/Todo.vue', () => {
  let todosRef: ReturnType<typeof ref<Todo[]>>

  beforeEach(() => {
    todosRef = ref<Todo[]>([])
    useLazyAsyncDataMock.mockReset()
    useLazyAsyncDataMock.mockImplementation(() => ({
      data: todosRef as any,
      error: ref(null),
      pending: ref(false)
    }))
    kyPostMock.mockClear()
    kyJsonMock.mockClear()
    mockKyInstance.mockClear()
  })

  it('shows loading state', () => {
    initUseAsyncDataMock({ pending: ref(true) })
    const wrapper = mount(TodoPage)
    expect(wrapper.text()).toContain('Loading todos...')
  })

  it('shows error when fetch fails', () => {
    initUseAsyncDataMock({ error: ref({ message: 'Failed to fetch todos' }) })
    const wrapper = mount(TodoPage)
    expect(wrapper.text()).toContain('Failed to fetch todos')
  })

  it('renders todo list', () => {
    const todos = ref([
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: false }
    ])
    initUseAsyncDataMock({ data: todos })
    const wrapper = mount(TodoPage)
    const items = wrapper.findAll('[data-test="todo-item"]')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toBe('Todo 1')
    expect(items[1].text()).toBe('Todo 2')
    expect(wrapper.find('[data-test="no-todos"]').exists()).toBe(false)
  })

  it('shows empty state when no todos', () => {
    initUseAsyncDataMock()
    const wrapper = mount(TodoPage)
    expect(wrapper.find('[data-test="no-todos"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-test="todo-item"]').length).toBe(0)
  })

  it('adds a todo successfully', async () => {
    kyJsonMock.mockResolvedValueOnce({ id: 2, title: 'New Todo', completed: false })

    const wrapper = mount(TodoPage)
    const input = wrapper.find('[data-test="todo-input"]')
    await input.setValue('New Todo')
    await input.trigger('keyup.enter')
    await flushPromises()

    expect(kyPostMock).toHaveBeenCalledWith('todos', {
      json: { title: 'New Todo', completed: false }
    })
    expect(kyJsonMock).toHaveBeenCalled()

    const items = wrapper.findAll('[data-test="todo-item"]')
    expect(items).toHaveLength(1)
    expect(items[0].text()).toBe('New Todo')
    expect((input.element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('[data-test="add-error"]').exists()).toBe(false)
  })

  it('shows error when adding empty todo', async () => {
    const wrapper = mount(TodoPage)
    const input = wrapper.find('[data-test="todo-input"]')
    await input.setValue('')
    await input.trigger('keyup.enter')
    await flushPromises()

    expect(wrapper.find('[data-test="add-error"]').text()).toBe('Todo cannot be empty')
    expect(wrapper.findAll('[data-test="todo-item"]').length).toBe(0)
    expect(kyPostMock).not.toHaveBeenCalled()
  })

  it('shows error when API add todo fails', async () => {
    kyJsonMock.mockRejectedValueOnce(new Error('API error'))

    const wrapper = mount(TodoPage)
    const input = wrapper.find('[data-test="todo-input"]')
    await input.setValue('New Todo')
    await input.trigger('keyup.enter')
    await flushPromises()

    expect(wrapper.find('[data-test="add-error"]').text()).toBe('Failed to add todo')
    expect(kyPostMock).toHaveBeenCalledWith('todos', {
      json: { title: 'New Todo', completed: false }
    })
  })

  it('shows error when adding duplicate todo', async () => {
    initUseAsyncDataMock({ data: ref([{ id: 1, title: 'Todo 1', completed: false }]) })
    const wrapper = mount(TodoPage)
    const input = wrapper.find('[data-test="todo-input"]')
    await input.setValue('Todo 1')
    await input.trigger('keyup.enter')
    await flushPromises()

    expect(wrapper.find('[data-test="add-error"]').text()).toBe('Todo already exists')
    expect(wrapper.findAll('[data-test="todo-item"]').length).toBe(1)
    expect(kyPostMock).not.toHaveBeenCalled()
  })
})
