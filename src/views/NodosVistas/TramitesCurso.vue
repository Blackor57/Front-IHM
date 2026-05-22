<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const listaTramites = ref([])
const cargando = ref(true)
const errorApi = ref(false)

// Asistencia de voz nativa IHM
const hablarTexto = (texto) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-PE'
    window.speechSynthesis.speak(utterance)
  }
}

// Simulación de carga mapeada de tu backend en Spring Boot
const consultarTramites = async () => {
  cargando.value = true
  errorApi.value = false
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Lista de trámites actualizada con fecha de inicio y término
    listaTramites.value = [
      {
        id: 1,
        nombre: 'Duplicado de DNI Electrónico',
        estado: 'En Proceso',
        visto: 'No leído',
        fechaInicio: '10/05/2026',
        fechaTermino: 'Pendiente'
      },
      {
        id: 2,
        nombre: 'Inscripción en el Padrón SIS',
        estado: 'Aprobado',
        visto: 'Leído',
        fechaInicio: '02/05/2026',
        fechaTermino: '08/05/2026'
      },
      {
        id: 3,
        nombre: 'Actualización de Estado Civil',
        estado: 'Observado',
        visto: 'No leído',
        fechaInicio: '28/04/2026',
        fechaTermino: 'Falta Sustento'
      }
    ]
    
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
        <p class="subtitle">Seguimiento detallado y cronograma de solicitudes ingresadas a la plataforma del estado</p>
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
                <th>Fecha Inicio</th>
                <th>Fecha Término</th>
                <th>Estado</th>
                <th>Visto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tramite in listaTramites" :key="tramite.id">
                <td class="font-bold-cell">{{ tramite.nombre }}</td>
                <td class="date-cell">{{ tramite.fechaInicio }}</td>
                <td class="date-cell">
                  <span :class="tramite.fechaTermino === 'Pendiente' ? 'text-pending' : 'text-completed'">
                    {{ tramite.fechaTermino }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="tramite.estado.toLowerCase().replace(' ', '-')">
                    {{ tramite.estado }}
                  </span>
                </td>
                <td>
                  <span class="view-tag" :class="{ 'tag-unread': tramite.visto === 'No leído' }">
                    {{ tramite.visto }}
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
            @click="hablarTexto('Se muestra en pantalla la tabla con sus trámites, incluyendo la fecha en que inició la solicitud y la fecha estimada de cierre o término.')"
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