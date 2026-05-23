<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api' // <- Conexión real para limpiar token

const router = useRouter()

// Variable reactiva para almacenar el nombre dinámico del ciudadano
const nombreUsuario = ref('Usuario Ciudadano')

// Función de asistencia de voz nativa IHM con acento local (Perú)
const hablarTexto = (texto) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel() // Limpia lecturas en cola anterior
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-PE'
    window.speechSynthesis.speak(utterance)
  }
}

onMounted(() => {
  // Jalamos el nombre que guardamos en el login o registro de forma dinámica
  const nombreGuardado = localStorage.getItem('nombreCiudadano')
  if (nombreGuardado) {
    nombreUsuario.value = nombreGuardado
  }

  // Saludo automático personalizado al entrar a la vista
  hablarTexto(`Bienvenido ${nombreUsuario.value} al Panel de Consultas al Estado. Seleccione una de las opciones en pantalla.`)
})

// Función para controlar la redirección limpia a pantalla completa a cada módulo
const irANodo = (ruta, nombreNodo) => {
  hablarTexto(`Abriendo ${nombreNodo}`)
  router.push(`/panel-consultas/${ruta}`)
}

// Función para limpiar la sesión y salir de la plataforma de consultas
const cerrarSesion = () => {
  hablarTexto('Cerrando sesión de forma segura. Volviendo al inicio.')
  authService.logout() // <- LLAMADA REAL: Borra el token de Axios y localStorage
  localStorage.removeItem('nombreCiudadano') // Limpieza de seguridad
  router.push('/')
}
</script>

<template>
  <div class="panel-main-wrapper">
    <div class="panel-dashboard-card">

      <header class="panel-header">
        <p class="sub-titulo">PLATAFORMA DIGITAL DE ATENCIÓN</p>
        <h1>Panel de Consultas al Estado</h1>

        <div class="user-welcome-row">
          <p class="welcome-user">BIENVENIDO, <span class="user-highlight">{{ nombreUsuario }}</span></p>
          <button
              type="button"
              class="voice-main-btn"
              @click="hablarTexto(`Sesión activa de ${nombreUsuario}`)"
              title="Escuchar nombre del usuario"
          >
            🔊
          </button>
        </div>
        <small class="post-verificacion">(Post-Verificación DNI)</small>
      </header>

      <main class="nodes-grid">
        <div class="node-box" @click="irANodo('mi-salud', 'Mi Salud SIS')">
          <div class="node-icon-wrapper red-icon">❤️</div>
          <div class="node-text-wrapper">
            <h3>MI SALUD</h3>
            <p>(SIS)</p>
          </div>
        </div>

        <div class="node-box" @click="irANodo('tramites-curso', 'Mis Trámites')">
          <div class="node-icon-wrapper orange-icon">📄</div>
          <div class="node-text-wrapper">
            <h3>MIS TRÁMITES</h3>
            <p>En curso</p>
          </div>
        </div>

        <div class="node-box" @click="irANodo('consultar-bonos', 'Consultar Bonos')">
          <div class="node-icon-wrapper gold-icon">🪙</div>
          <div class="node-text-wrapper">
            <h3>CONSULTAR BONOS</h3>
            <p>Subsidios estatales</p>
          </div>
        </div>

        <div class="node-box" @click="irANodo('noticias', 'Noticias')">
          <div class="node-icon-wrapper blue-icon">📰</div>
          <div class="node-text-wrapper">
            <h3>NOTICIAS</h3>
            <p>Consulte noticias del estado</p>
          </div>
        </div>

        <div class="node-box" @click="irANodo('perfiles', 'Mi Perfil')">
          <div class="node-icon-wrapper alert-icon">👤</div>
          <div class="node-text-wrapper">
            <h3>MI PERFIL</h3>
            <p>Ver perfil ciudadano</p>
          </div>
        </div>

        <div class="node-box" @click="irANodo('alertas', 'Alertas')">
          <div class="node-icon-wrapper green-icon">🔔</div>
          <div class="node-text-wrapper">
            <h3>ALERTAS</h3>
            <p>Avisos del sistema</p>
          </div>
        </div>
      </main>

      <footer class="panel-footer">

        <div class="footer-links-group">
          <span class="footer-tag">Plataforma del Estado Peruano</span>
          <div class="links-row">
            <a href="#" @click.prevent="hablarTexto('Abriendo Términos y condiciones de uso')">Términos de Uso</a>
            <span class="dot-separator">•</span>
            <a href="#" @click.prevent="hablarTexto('Abriendo Políticas de Privacidad Digital')">Privacidad</a>
            <span class="dot-separator">•</span>
            <span class="phone-support" title="Central Telefónica Nacional">📞 Central: 1845</span>
          </div>
        </div>

        <div class="footer-actions">
          <button type="button" class="btn-exit-panel" @click="cerrarSesion">
            <span>Cerrar Sesión</span> <span class="exit-icon">🚪</span>
          </button>

          <button
              type="button"
              class="help-icon-btn"
              @click="hablarTexto('Asistente de voz del panel activo. Presione cualquiera de las tarjetas superiores para gestionar sus datos, revisar bonos o verificar el estado de sus trámites en curso.')"
              title="Escuchar guía de asistencia de voz"
          >
            <span class="help-question-mark">?</span>
          </button>
        </div>

      </footer>

    </div>
  </div>
</template>

<style scoped src="@/assets/CSS/panel.css"></style>