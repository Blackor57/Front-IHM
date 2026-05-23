<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { procedureService } from '@/services/api' // <- Conexión real

const router = useRouter()
const listaTramites = ref([])
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

const consultarTramites = async () => {
  cargando.value = true
  errorApi.value = false

  try {
    const data = await procedureService.getAll()
    listaTramites.value = data

    hablarTexto(`Historial de trámites cargado. Tienes ${listaTramites.value.length} solicitudes registradas en el sistema.`)
  } catch (err) {
    errorApi.value = true
    hablarTexto('Error al sincronizar las solicitudes con el servidor.')
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  consultarTramites()
})

const volverAlPanel = () => {
  hablarTexto('Regresando al menú de selección.')
  router.push('/panel-consultas')
}
</script>

<template>
  <div class="tramites-main-wrapper">
    <div class="tramites-card">

      <button type="button" class="btn-back-panel" @click="volverAlPanel">
        ← Volver al Panel
      </button>

      <header class="tramites-header">
        <div class="title-row">
          <span class="folder-icon">📄</span>
          <h2>Mis Trámites en Curso</h2>
        </div>
        <p class="subtitle">Seguimiento detallado de solicitudes ingresadas a la plataforma del estado</p>
      </header>

      <div v-if="cargando" class="loading-box">
        <div class="circle-spinner"></div>
        <p>Buscando expedientes en el sistema...</p>
      </div>

      <div v-else-if="errorApi" class="error-box">
        <p>⚠️ Ocurrió un error al conectar con la base de datos de trámites.</p>
        <button type="button" class="btn-retry" @click="consultarTramites">Reintentar</button>
      </div>

      <div class="tramites-content" v-else>
        <div class="table-responsive-container">
          <table class="tramites-table">
            <thead>
            <tr>
              <th>Trámite</th>
              <th>Descripción</th>
              <th>Fecha Inicio</th>
              <th>Estado</th>
              <th>Visto</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="tramite in listaTramites" :key="tramite.id">
              <td class="font-bold-cell">{{ tramite.type }}</td>
              <td>{{ tramite.description }}</td>
              <td class="date-cell">{{ new Date(tramite.createdAt).toLocaleDateString() }}</td>
              <td>
                  <span class="status-badge" :class="tramite.status.toLowerCase().replace(' ', '-')">
                    {{ tramite.status }}
                  </span>
              </td>
              <td>
                  <span class="view-tag" :class="{ 'tag-unread': !tramite.checked }">
                    {{ tramite.checked ? 'Leído' : 'No leído' }}
                  </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <footer class="tramites-footer-actions">
          <button
              type="button"
              class="btn-audio-report"
              @click="hablarTexto('Se muestra en pantalla la tabla con sus trámites en curso y su estado actual.')"
          >
            🔊 Escuchar Reporte de Trámites
          </button>
        </footer>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/tramites.css";
</style>