import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import PerfPage from '@/pages/perf.vue'

// Helper to get vm methods from <script setup>
function getVm(wrapper: VueWrapper) {
  return wrapper.vm || wrapper.findComponent({ name: 'PerfPage' }).vm
}

describe('PerfPage performance', () => {
  let wrapper: VueWrapper
  let vm: any

  beforeEach(async () => {
    wrapper = mount(PerfPage)
    await flushPromises()
    vm = getVm(wrapper)
  })

  it('should render 10k items under 1000ms', async () => {
    const t0 = performance.now()
    wrapper = mount(PerfPage)
    await flushPromises()
    const t1 = performance.now()
    const renderTime = t1 - t0
    console.log('Render 10k items:', renderTime, 'ms')
    expect(renderTime).toBeLessThan(1000)
  })

  it('should update 1000 items under 200ms', async () => {
    const t0 = performance.now()
    await vm.updateMany()
    await flushPromises()
    const t1 = performance.now()
    const updateTime = t1 - t0
    console.log('Update 1000 items:', updateTime, 'ms')
    expect(updateTime).toBeLessThan(200)
  })

  it('should add 1000 items under 200ms', async () => {
    const t0 = performance.now()
    await vm.addMany()
    await flushPromises()
    const t1 = performance.now()
    const addTime = t1 - t0
    console.log('Add 1000 items:', addTime, 'ms')
    expect(addTime).toBeLessThan(200)
  })

  it('should remove 1000 items under 200ms', async () => {
    const t0 = performance.now()
    await vm.removeMany()
    await flushPromises()
    const t1 = performance.now()
    const removeTime = t1 - t0
    console.log('Remove 1000 items:', removeTime, 'ms')
    expect(removeTime).toBeLessThan(200)
  })
})
