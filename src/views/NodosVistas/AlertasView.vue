<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const listaAlertas = ref([])
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

// Simulación de carga de la entidad Alertas desde tu backend
const consultarAlertas = async () => {
  cargando.value = true
  errorApi.value = false
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Lista simulada mapeada de tu base de datos
    listaAlertas.value = [
      {
        id: 1,
        titulo: 'Campaña de Vacunación Integral',
        mensaje: 'Se le recuerda que su centro médico asignado cuenta con dosis disponibles para el refuerzo estacional.',
        fecha: '22/05/2026',
        leido: false
      },
      {
        id: 2,
        titulo: 'Actualización de Credenciales Exitosa',
        mensaje: 'Su correo electrónico de contacto ha sido modificado correctamente en la plataforma digital.',
        fecha: '20/05/2026',
        leido: true
      },
      {
        id: 3,
        titulo: 'Asignación de Subsidio Pendiente',
        mensaje: 'Un nuevo abono monetario figura registrado bajo su número de DNI. Revise el módulo correspondiente.',
        fecha: '15/05/2026',
        leido: false
      }
    ]
    
    const pendientes = listaAlertas.value.filter(a => !a.leido).length
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

// Función interactiva para marcar como leída la notificación de forma dinámica
const marcarComoLeida = (alerta) => {
  if (!alerta.leido) {
    alerta.leido = true
    hablarTexto(`Marcado como leído: ${alerta.titulo}`)
  } else {
    hablarTexto(`Leyendo aviso: ${alerta.mensaje}`)
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
            :key="alerta.id" 
            class="alerta-tile"
            :class="{ 'alerta-leida': alerta.leido }"
            @click="marcarComoLeida(alerta)"
          >
            <div class="tile-header">
              <span class="status-indicator"></span>
              <span class="tile-date">{{ alerta.fecha }}</span>
            </div>
            
            <div class="tile-body">
              <h3>{{ alerta.titulo }}</h3>
              <p>{{ alerta.mensaje }}</p>
            </div>
            
            <div class="tile-footer" v-if="!alerta.leido">
              <span class="action-hint">👉 Presione para marcar como leído</span>
            </div>
          </div>

        </div>

        <footer class="alertas-footer-actions">
          <button 
            type="button" 
            class="btn-audio-report"
            @click="hablarTexto('Se muestran en pantalla tres mensajes importantes. Puede presionar cualquiera de ellos para marcarlo como leído o volverlo a escuchar.')"
          >
            🔊 Escuchar Instrucciones
          </button>
        </footer>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 🔥 Importación externa limpia para evitar problemas de compilación en Vite */
@import "@/assets/css/alertas.css";
</style>