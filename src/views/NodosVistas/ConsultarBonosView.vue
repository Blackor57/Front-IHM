<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const listaBonos = ref([])
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

// Consumo simulado de tu API que devuelve múltiples registros de la tabla Bono
const consultarSubsidios = async () => {
  cargando.value = true
  errorApi.value = false
  
  try {
    // Simulación de espera de servidor (1 segundo)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Lista de bonos mapeados desde tu Base de Datos
    listaBonos.value = [
      {
        id_bono: 601,
        monto_bono: 350.00,
        estado_bono: 'PENDIENTE',
        fecha_emision: '15/05/2026',
        nombre_subsidio: 'Bono Alimentario 2026'
      },
      {
        id_bono: 402,
        monto_bono: 270.00,
        estado_bono: 'PAGADO',
        fecha_emision: '12/11/2025',
        nombre_subsidio: 'Subsidio Yanapay Extraordinario'
      },
      {
        id_bono: 215,
        monto_bono: 380.00,
        estado_bono: 'PAGADO',
        fecha_emision: '04/06/2025',
        nombre_subsidio: 'Bono Familiar Centralizado'
      }
    ]
    
    // Contar cuántos están pendientes
    const pendientes = listaBonos.value.filter(b => b.estado_bono === 'PENDIENTE').length
    if (pendientes > 0) {
      hablarTexto(`Consulta completada. Registramos un total de ${listaBonos.value.length} subsidios. Tienes ${pendientes} bono pendiente por cobrar.`)
    } else {
      hablarTexto(`Consulta completada. Tienes ${listaBonos.value.length} bonos registrados y todos figuran como cobrados de forma exitosa.`)
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
        <p>⚠️ Ocurrió un problema al traer los datos financieros del MIDIS.</p>
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
              <tr v-for="bono in listaBonos" :key="bono.id_bono" class="bono-row">
                <td class="td-name">
                  <span class="sub-icon">{{ bono.estado_bono === 'PAGADO' ? '✅' : '⏳' }}</span>
                  {{ bono.nombre_subsidio }}
                </td>
                <td class="td-date">{{ bono.fecha_emision }}</td>
                <td class="td-amount font-bold">S/ {{ bono.monto_bono.toFixed(2) }}</td>
                <td>
                  <span class="status-badge" :class="bono.estado_bono.toLowerCase()">
                    <span class="indicator-dot"></span>
                    {{ bono.estado_bono }}
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
            @click="hablarTexto('Abajo en pantalla se muestra la tabla con tres filas. Las dos últimas corresponden a subsidios anteriores ya pagados por el banco de la nación.')"
          >
            🔊 Escuchar Resumen de Historial
          </button>
        </footer>
      </div>

    </div>
  </div>
</template>

<style scoped src="@/assets/CSS/consultarbonos.css"></style>