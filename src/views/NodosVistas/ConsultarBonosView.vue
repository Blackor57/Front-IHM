<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bondService } from '@/services/api' // <- Conexión real

const router = useRouter()
const listaBonos = ref([])
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

const consultarSubsidios = async () => {
  cargando.value = true
  errorApi.value = false

  try {
    const data = await bondService.getAll()
    listaBonos.value = data

    const pendientes = listaBonos.value.filter(b => b.status === 'disponible').length
    if (pendientes > 0) {
      hablarTexto(`Consulta completada. Tienes ${pendientes} bono pendiente por cobrar.`)
    } else {
      hablarTexto(`Consulta completada. Todos tus bonos figuran cobrados.`)
    }
  } catch (err) {
    errorApi.value = true
    hablarTexto('Error al conectar con el servidor de subsidios económicos.')
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  consultarSubsidios()
})

const volverAlPanel = () => {
  hablarTexto('Regresando al menú de selección principal.')
  router.push('/panel-consultas')
}
</script>

<template>
  <div class="bonos-main-wrapper">
    <div class="bonos-card">

      <button class="btn-back-panel" @click="volverAlPanel" title="Volver al Panel de Consultas">
        ← Volver al Panel
      </button>

      <header class="bonos-header">
        <div class="title-row">
          <span class="coin-icon">🪙</span>
          <h2>Historial de Subsidios y Bonos</h2>
        </div>
        <p class="subtitle">Lista oficial de apoyos económicos asignados a su identidad</p>
      </header>

      <div v-if="cargando" class="loading-box">
        <div class="circle-spinner"></div>
        <p>Sincronizando el historial completo de cobros...</p>
      </div>

      <div v-else-if="errorApi" class="error-box">
        <p>⚠️ Ocurrió un problema al traer los datos financieros.</p>
        <button class="btn-retry" @click="consultarSubsidios">Reintentar</button>
      </div>

      <div v-else class="bonos-content">
        <div class="table-container">
          <table class="bonos-table">
            <thead>
            <tr>
              <th>Subsidio</th>
              <th>Fecha Asignada</th>
              <th>Monto</th>
              <th>Estado de Cobro</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="bono in listaBonos" :key="bono.id" class="bono-row">
              <td class="td-name">
                <span class="sub-icon">{{ bono.status === 'disponible' ? '⏳' : '✅' }}</span>
                {{ bono.type }}
              </td>
              <td class="td-date">{{ new Date(bono.dateLimit).toLocaleDateString() }}</td>
              <td class="td-amount font-bold">S/ {{ bono.amount.toFixed(2) }}</td>
              <td>
                  <span class="status-badge" :class="bono.status.toLowerCase()">
                    <span class="indicator-dot"></span>
                    {{ bono.status.toUpperCase() }}
                  </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <footer class="bonos-actions">
          <button
              type="button"
              class="btn-audio-report"
              @click="hablarTexto('Se muestra en pantalla la lista de subsidios económicos asociados a su cuenta.')"
          >
            🔊 Escuchar Resumen de Historial
          </button>
        </footer>
      </div>

    </div>
  </div>
</template>

<style scoped src="@/assets/CSS/consultarbonos.css"></style>