<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  siteKey: { type: String, required: true },
})

const emit = defineEmits(['verified', 'error'])
const container = ref(null)
let widgetId = null

onMounted(() => {
  if (!props.siteKey || props.siteKey === 'PENDING') {
    emit('verified', 'bypass-pending')
    return
  }
  const load = () => {
    widgetId = window.turnstile.render(container.value, {
      sitekey: props.siteKey,
      callback: (token) => emit('verified', token),
      'error-callback': () => emit('error'),
    })
  }
  if (window.turnstile) {
    load()
  } else {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.onload = load
    document.head.appendChild(script)
  }
})

onUnmounted(() => {
  if (widgetId != null && window.turnstile) window.turnstile.remove(widgetId)
})
</script>

<template>
  <div ref="container"></div>
</template>
