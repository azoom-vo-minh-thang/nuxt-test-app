<script setup lang="ts">
const items = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` })))
const renderTime = ref(0)

const measureRender = async (fn?: () => void | Promise<void>) => {
  const t0 = performance.now()
  if (fn) await fn()
  await nextTick()
  const t1 = performance.now()
  renderTime.value = +(t1 - t0).toFixed(2)
}

const updateMany = async () => {
  await measureRender(() => {
    for (let i = 0; i < 1000; i++) {
      items.value[i].name = `Updated ${i}`
    }
  })
}

const addMany = async () => {
  await measureRender(() => {
    for (let i = 0; i < 1000; i++) {
      items.value.push({ id: items.value.length + i, name: `New ${i}` })
    }
  })
}

const removeMany = async () => {
  await measureRender(() => {
    items.value.splice(0, 1000)
  })
}

onMounted(() => {
  measureRender()
})
</script>

<template>
  <div>
    <h1>Performance Test: Large List</h1>
    <button @click="updateMany">Update 1000 items</button>
    <button @click="addMany">Add 1000 items</button>
    <button @click="removeMany">Remove 1000 items</button>
    <div>
      <strong>Render time:</strong> {{ renderTime }} ms
    </div>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  max-height: calc(100vh - 145px);
  overflow: auto;
  border: 1px solid #eee;
}
li {
  font-size: 13px;
}
</style>
