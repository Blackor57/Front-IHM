<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cargando = ref(true)
const errorApi = ref(false)

// Datos reactivos de la cobertura actual del Ciudadano
const coberturaActual = ref({
  tipoSeguro: 'SIS Para Todos',
  estado: 'ACTIVO',
  establecimiento: 'Centro de Salud Carabayllo (Posta Médica)'
})

// Historial de Seguros que el ciudadano tuvo previamente
const historialSeguros = ref([])

// Asistencia de voz nativa IHM
const hablarTexto = (texto) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-PE'
    window.speechSynthesis.speak(utterance)
  }
}

const consultarSalud = async () => {
  cargando.value = true
  errorApi.value = false
  
  try {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Datos históricos simulados de tu backend
    historialSeguros.value = [
      {
        id: 101,
        seguro: 'EsSalud - Régimen Regular',
        entidad: 'Seguro Social de Salud',
        fechaInicio: '01/02/2020',
        fechaFin: '31/12/2024',
        motivo: 'Cese Laboral'
      },
      {
        id: 102,
        seguro: 'SIS Microempresas',
        entidad: 'Seguro Integral de Salud',
        fechaInicio: '10/08/2018',
        fechaFin: '15/01/2020',
        motivo: 'Cambio de Régimen'
      }
    ]
    
    hablarTexto("Módulo de salud cargado. Se muestra su estado de aseguramiento actual y su historial de seguros pasados.")
  } catch (err) {
    errorApi.value = true
    hablarTexto('Error al conectar con el servidor de salud.')
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  consultarSalud()
})

const volverAlPanel = () => {
  hablarTexto('Regresando al menú de selección.')
  router.push('/panel-consultas')
}
</script>

<template>
  <div class="salud-main-wrapper">
    <div class="salud-card">
      
      <button type="button" class="btn-back-panel" @click="volverAlPanel">
        ← Volver al Panel
      </button>

      <header class="salud-header">
        <div class="title-row">
          <span class="health-icon">❤️</span>
          <h2>Estado de Aseguramiento - SIS</h2>
        </div>
        <p class="subtitle">Información oficial mapeada de su registro de salud estatal</p>
      </header>

      <div v-if="cargando" class="loading-box">
        <div class="circle-spinner"></div>
        <p>Sincronizando datos de afiliación...</p>
      </div>

      <div v-else-if="errorApi" class="error-box">
        <p>⚠️ No se pudo establecer conexión con el sistema sanitario.</p>
        <button type="button" class="btn-retry" @click="consultarSalud">Reintentar</button>
      </div>

      <div class="salud-content" v-else>
        <div class="info-widgets-grid">
          <div class="info-widget-box">
            <span class="widget-lbl">TIPO DE SEGURO</span>
            <p class="widget-val">{{ coberturaActual.tipoSeguro }}</p>
          </div>

          <div class="info-widget-box">
            <span class="widget-lbl">ESTADO DE AFILIACIÓN</span>
            <div class="status-pill-wrapper">
              <span class="status-pill-active">
                <span class="dot-active">•</span> {{ coberturaActual.estado }}
              </span>
            </div>
          </div>

          <div class="info-widget-box full-width-widget">
            <span class="widget-lbl">ESTABLECIMIENTO ASIGNADO</span>
            <p class="widget-val">{{ coberturaActual.establecimiento }}</p>
          </div>
        </div>

        <div class="history-section-block">
          <h3 class="table-section-title">Historial de Seguros Anteriores</h3>
          <div class="table-responsive-container">
            <table class="salud-table">
              <thead>
                <tr>
                  <th>Seguro / Régimen</th>
                  <th>Entidad Emisora</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Motivo de Fin</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="seguro in historialSeguros" :key="seguro.id">
                  <td class="font-bold-cell">{{ seguro.seguro }}</td>
                  <td class="text-nowrap-cell">{{ seguro.entidad }}</td>
                  <td class="date-cell">{{ seguro.fechaInicio }}</td>
                  <td class="date-cell">{{ seguro.fechaFin }}</td>
                  <td class="text-nowrap-cell">
                    <span class="reason-badge-fixed">{{ seguro.motivo }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <footer class="salud-footer-actions">
          <button 
            type="button" 
            class="btn-audio-report"
            @click="hablarTexto(`Seguro actual: ${coberturaActual.tipoSeguro}. Estado: ${coberturaActual.estado}. Establecimiento: ${coberturaActual.establecimiento}.`)"
          >
            🔊 Escuchar Reporte Completo
          </button>
        </footer>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/misalud.css";
</style>