<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  siteKey: { type: String, required: true },
  size: { type: String, default: 'normal' },
  // 'interaction-only': invisible salvo que Cloudflare necesite que la persona haga clic
  appearance: { type: String, default: 'always' },
})

const emit = defineEmits(['verified', 'error', 'expired'])
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
      size: props.size,
      appearance: props.appearance,
      callback: (token) => emit('verified', token),
      'error-callback': () => emit('error'),
      'expired-callback': () => emit('expired'),
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

// Los tokens son de un solo uso: tras un envío fallido hay que pedir uno nuevo
const reset = () => {
  if (widgetId != null && window.turnstile) window.turnstile.reset(widgetId)
}
defineExpose({ reset })

onUnmounted(() => {
  if (widgetId != null && window.turnstile) window.turnstile.remove(widgetId)
})
</script>

<template>
  <div ref="container"></div>
</template>
