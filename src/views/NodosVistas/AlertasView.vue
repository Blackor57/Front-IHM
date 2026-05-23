<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { notificationService } from '@/services/api' // <- Conexión real

const router = useRouter()
const listaAlertas = ref([])
const cargando = ref(true)
const errorApi = ref(false)

const hablarTexto = (texto) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-PE'
    window.speechSynthesis.speak(utterance)
  }
}

const consultarAlertas = async () => {
  cargando.value = true
  errorApi.value = false

  try {
    const data = await notificationService.getUnread()
    listaAlertas.value = data

    const pendientes = listaAlertas.value.filter(a => !a.checked).length
    if (pendientes > 0) {
      hablarTexto(`Bandeja de alertas sincronizada. Tienes ${pendientes} avisos nuevos sin leer.`)
    } else {
      hablarTexto(`Bandeja de alertas sincronizada. No registras nuevos avisos.`)
    }
  } catch (err) {
    errorApi.value = true
    hablarTexto('Error al sincronizar las alertas del sistema.')
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  consultarAlertas()
})

const marcarComoLeida = async (alerta) => {
  if (!alerta.checked) {
    try {
      await notificationService.markAsRead({
        id: alerta.id,
        request: alerta.request
      })
      alerta.checked = true
      hablarTexto(`Marcado como leído.`)
      // Lo quitamos de la lista reactivamente
      listaAlertas.value = listaAlertas.value.filter(a => a.id !== alerta.id || a.request !== alerta.request)
    } catch (error) {
      console.error(error)
    }
  }
}

const volverAlPanel = () => {
  hablarTexto('Regresando al menú de selección.')
  router.push('/panel-consultas')
}
</script>

<template>
  <div class="alertas-main-wrapper">
    <div class="alertas-card">

      <button type="button" class="btn-back-panel" @click="volverAlPanel">
        ← Volver al Panel
      </button>

      <header class="alertas-header">
        <div class="title-row">
          <span class="bell-icon">🔔</span>
          <h2>Avisos y Alertas del Sistema</h2>
        </div>
        <p class="subtitle">Mensajes informativos y de seguridad enviados directamente a su cuenta ciudadana</p>
      </header>

      <div v-if="cargando" class="loading-box">
        <div class="circle-spinner"></div>
        <p>Buscando avisos recientes en el servidor...</p>
      </div>

      <div v-else-if="errorApi" class="error-box">
        <p>⚠️ No se pudo sincronizar la bandeja de notificaciones.</p>
        <button type="button" class="btn-retry" @click="consultarAlertas">Reintentar</button>
      </div>

      <div class="alertas-content" v-else>
        <div class="alertas-list">

          <div
              v-for="alerta in listaAlertas"
              :key="alerta.id + '-' + alerta.request"
              class="alerta-tile"
              :class="{ 'alerta-leida': alerta.checked }"
              @click="marcarComoLeida(alerta)"
          >
            <div class="tile-header">
              <span class="status-indicator"></span>
              <span class="tile-date">📅 {{ new Date(alerta.createdAt).toLocaleDateString() }}</span>
            </div>

            <div class="tile-body">
              <h3>{{ alerta.type }}</h3>
              <p v-if="alerta.request === 'bond'">Monto asignado: S/ {{ alerta.amount }}</p>
              <p v-if="alerta.request === 'procedure'">Estado actual: {{ alerta.status }}</p>
              <p v-if="alerta.request === 'affiliation'">Establecimiento: {{ alerta.stablishment }}</p>
            </div>

            <div class="tile-footer" v-if="!alerta.checked">
              <span class="action-hint">👉 Presione para marcar como leído</span>
            </div>
          </div>

        </div>

        <footer class="alertas-footer-actions">
          <button
              type="button"
              class="btn-audio-report"
              @click="hablarTexto('Se muestran en pantalla sus avisos pendientes de revisión.')"
          >
            🔊 Escuchar Instrucciones
          </button>
        </footer>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/alertas.css";
</style>