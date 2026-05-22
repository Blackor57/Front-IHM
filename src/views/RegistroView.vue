<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreCompleto = ref('')
const correoElectronico = ref('')
const contrasena = ref('')

const mostrandoContrasena = ref(false)
const cargandoReniec = ref(false)
const mensajeFeedback = ref('')

const hablarTexto = (texto) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-PE'
    window.speechSynthesis.speak(utterance)
  }
}

const procesarRegistro = () => {
  if (!nombreCompleto.value || !correoElectronico.value || !contrasena.value) {
    mensajeFeedback.value = 'Por favor, complete todos los campos requeridos.'
    hablarTexto(mensajeFeedback.value)
    return
  }

  cargandoReniec.value = true
  mensajeFeedback.value = 'Validando sus datos de identidad ante el servicio de RENIEC...'
  hablarTexto(mensajeFeedback.value)

  setTimeout(() => {
    cargandoReniec.value = false
    mensajeFeedback.value = 'Registro exitoso. Identidad verificada correctamente.'
    hablarTexto(mensajeFeedback.value)
    
    // 🔥 GUARDAMOS EL NOMBRE DINÁMICO AQUÍ
    localStorage.setItem('nombreCiudadano', nombreCompleto.value)
    
    // Redirigir al panel después de registrarse exitosamente
    setTimeout(() => {
      router.push('/panel-consultas')
    }, 1500)
  }, 2500)
}
</script>

<template>
  <div class="registro-wrapper">
    <div class="registro-card">
      <router-link to="/" class="btn-back" title="Volver al inicio">
        <span class="back-icon">←</span> Volver
      </router-link>

      <header>
        <p class="sub-titulo">REGISTRO DE USUARIO</p>
        <h1>Crea tu Cuenta</h1>
      </header>

      <div class="form-body">
        <div class="input-wrapper">
          <input type="text" v-model="nombreCompleto" placeholder="Nombre Completo" aria-label="Nombre Completo" />
          <button type="button" class="icon-btn" @click="hablarTexto('Campo Nombre Completo')">🔊</button>
        </div>

        <div class="input-wrapper">
          <input type="email" v-model="correoElectronico" placeholder="Correo Electrónico" aria-label="Correo Electrónico" />
          <button type="button" class="icon-btn" @click="hablarTexto('Campo Correo Electrónico')">👤</button>
        </div>

        <div class="input-wrapper">
          <input :type="mostrandoContrasena ? 'text' : 'password'" v-model="contrasena" placeholder="Contraseña" aria-label="Contraseña" />
          <button type="button" class="icon-btn" @click="mostrandoContrasena = !mostrandoContrasena">
            {{ mostrandoContrasena ? '👁️' : '🙈' }}
          </button>
        </div>

        <button class="btn-submit" :disabled="cargandoReniec" @click="procesarRegistro">
          {{ cargandoReniec ? 'Validando...' : 'Registrarme y Validar' }}
        </button>

        <p v-if="mensajeFeedback" class="feedback-box" role="alert">
          {{ mensajeFeedback }}
        </p>
      </div>

      <div class="card-footer">
        <p>¿Ya tienes una cuenta? 
          <router-link to="/login" class="login-link">Inicia sesión aquí</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/CSS/registro.css"></style>