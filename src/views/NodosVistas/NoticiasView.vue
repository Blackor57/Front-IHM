<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const listaNoticias = ref([])
const cargando = ref(true)
const errorApi = ref(false)

// 🔥 NUEVO: Estado interactivo exclusivo para pausar/activar la voz en este módulo
const vozActiva = ref(true)

// Asistencia de voz nativa IHM
const hablarTexto = (texto) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel() // Limpia lecturas previas en cola
    
    // Si la voz está pausada, bloqueamos cualquier reproducción de audio
    if (!vozActiva.value) return
    
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-PE'
    window.speechSynthesis.speak(utterance)
  }
}

// Conmutar el estado del asistente de voz
const toggleVoz = () => {
  vozActiva.value = !vozActiva.value
  if (!vozActiva.value) {
    window.speechSynthesis.cancel() // Silencia al instante al pausar
  } else {
    hablarTexto("Asistente de voz reactivado.")
  }
}

// Simulación de consumo de la entidad Noticias
const consultarNoticias = async () => {
  cargando.value = true
  errorApi.value = false
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    listaNoticias.value = [
      {
        id: 1,
        titulo: 'Padrón unificado del SIS amplía cobertura en zonas rurales',
        contenido: 'El Ministerio de Salud anunció la optimización de los sistemas digitales para agilizar la asignación de establecimientos médicos a nivel nacional.',
        fechaPublicacion: '22/05/2026',
        imagenUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 2,
        titulo: 'MIDIS anuncia cronograma de pago para el Bono Alimentario',
        contenido: 'Se habilitaron los canales digitales de consulta post-verificación de DNI para que los ciudadanos verifiquen sus fechas de abono bancario.',
        fechaPublicacion: '19/05/2026',
        imagenUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 3,
        titulo: 'RENIEC moderniza trámites de duplicado y firmas digitales',
        contenido: 'A partir de este mes, los ciudadanos podrán realizar el seguimiento biométrico de sus solicitudes en curso de manera 100% remota.',
        fechaPublicacion: '14/05/2026',
        imagenUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80'
      }
    ]
    
    hablarTexto(`Portal de noticias actualizado. Hemos sincronizado ${listaNoticias.value.length} publicaciones oficiales.`);
    
  } catch (err) {
    errorApi.value = true
    hablarTexto('Error al traer las publicaciones oficiales de prensa.')
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  consultarNoticias()
})

const volverAlPanel = () => {
  hablarTexto('Regresando al menú de selección.')
  router.push('/panel-consultas')
}
</script>

<template>
  <div class="noticias-main-wrapper">
    <div class="noticias-card">
      
      <div class="control-top-bar">
        <button type="button" class="btn-back-panel" @click="volverAlPanel">
          ← Volver al Panel
        </button>
        
        <button 
          type="button" 
          class="btn-toggle-voice" 
          :class="{ 'voice-muted': !vozActiva }"
          @click="toggleVoz"
          :title="vozActiva ? 'Pausar asistente de voz' : 'Activar asistente de voz'"
        >
          <span>{{ vozActiva ? '🔊 Voz: Activa' : '🔇 Voz: Pausada' }}</span>
        </button>
      </div>

      <header class="noticias-header">
        <div class="title-row">
          <span class="news-icon">📰</span>
          <h2>Noticias y Decretos del Estado</h2>
        </div>
        <p class="subtitle">Canal informativo oficializado para el seguimiento de subsidios, salud y trámites públicos</p>
      </header>

      <div v-if="cargando" class="loading-box">
        <div class="circle-spinner"></div>
        <p>Sincronizando notas de prensa institucionales...</p>
      </div>

      <div v-else-if="errorApi" class="error-box">
        <p>⚠️ No se pudo establecer conexión con el sistema de contenidos de Gob.pe.</p>
        <button type="button" class="btn-retry" @click="consultarNoticias">Reintentar</button>
      </div>

      <div class="noticias-content" v-else>
        <div class="noticias-grid">
          
          <article 
            v-for="noticia in listaNoticias" 
            :key="noticia.id" 
            class="noticia-item"
            @click="hablarTexto(`Titular: ${noticia.titulo}. Resumen: ${noticia.contenido}`)"
            title="Presione para escuchar la noticia por voz"
          >
            <div class="noticia-img-wrapper">
              <img :src="noticia.imagenUrl" :alt="noticia.titulo" class="noticia-img" />
              <span class="noticia-tag">Oficial</span>
            </div>
            
            <div class="noticia-body">
              <span class="noticia-date">📅 {{ noticia.fechaPublicacion }}</span>
              <h3>{{ noticia.titulo }}</h3>
              <p>{{ noticia.contenido }}</p>
            </div>
            
            <div class="noticia-footer">
              <span class="action-audio-hint">🔊 Presione para escuchar nota</span>
            </div>
          </article>

        </div>

        <footer class="noticias-footer-actions">
          <button 
            type="button" 
            class="btn-audio-report"
            @click="hablarTexto('Se muestran tres noticias importantes en pantalla. Puede presionar cualquiera de ellas para que el asistente lea el contenido completo de forma clara.')"
          >
            🔊 Escuchar Guía del Módulo
          </button>
        </footer>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/noticias.css";
</style>