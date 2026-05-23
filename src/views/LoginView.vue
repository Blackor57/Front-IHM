<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api.js' // <- Importamos el servicio

const router = useRouter()
const dni = ref('') // <- Cambiado de email a dni
const password = ref('')
const cargando = ref(false)
const mensajeError = ref('')

const escuchandoDni = ref(false)
const escuchandoPassword = ref(false)

const hablarTexto = (texto) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-PE'
    window.speechSynthesis.speak(utterance)
  }
}

onMounted(() => {
  hablarTexto('Inicio de sesión. Por favor, ingresa tu número de DNI y contraseña de acceso seguro.')
})

const dictarCampo = (campo) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert('Tu navegador no soporta el reconocimiento de voz.')
    return
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'es-PE'
  recognition.start()

  if (campo === 'dni') escuchandoDni.value = true
  if (campo === 'password') escuchandoPassword.value = true

  recognition.onresult = (event) => {
    let textoEscuchado = event.results[0][0].transcript
    if (campo === 'dni') {
      // Limpiamos espacios para quedarnos solo con los números del DNI
      dni.value = textoEscuchado.replace(/\s+/g, '')
    }
    if (campo === 'password') {
      password.value = textoEscuchado.replace(/\s+/g, '')
    }
  }

  recognition.onend = () => {
    escuchandoDni.value = false
    escuchandoPassword.value = false
  }
}

const handleLogin = async () => {
  cargando.value = true
  mensajeError.value = ''

  try {
    // Llamada real al backend enviando dni y password
    await authService.login({ dni: dni.value, password: password.value })

    // Dejamos un marcador genérico por si no se registró previamente el nombre en este navegador
    if(!localStorage.getItem('nombreCiudadano')){
      localStorage.setItem('nombreCiudadano', 'Ciudadano Autenticado')
    }

    router.push('/panel-consultas')
  } catch (error) {
    cargando.value = false
    mensajeError.value = error.response?.data?.message || 'Credenciales incorrectas. Inténtelo de nuevo.'
    hablarTexto(mensajeError.value)
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <router-link to="/" class="btn-back" title="Volver al inicio">
        <span class="back-icon">←</span> Volver
      </router-link>

      <div class="card-header">
        <h2>Identificación</h2>
        <p>Ingrese sus credenciales de acceso seguro</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label for="dni">Número de DNI</label>
          <div class="field-wrapper" :class="{ 'is-listening': escuchandoDni }">
            <span class="field-icon">🆔</span>
            <input id="dni" type="text" v-model="dni" placeholder="Ingrese su DNI" required maxlength="8" />
            <button type="button" class="mic-btn" :class="{ 'pulse-animation': escuchandoDni }" @click="dictarCampo('dni')">
              {{ escuchandoDni ? '🛑' : '🎙️' }}
            </button>
          </div>
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <div class="field-wrapper" :class="{ 'is-listening': escuchandoPassword }">
            <span class="field-icon">🔒</span>
            <input id="password" type="password" v-model="password" placeholder="••••••••" required />
            <button type="button" class="mic-btn" :class="{ 'pulse-animation': escuchandoPassword }" @click="dictarCampo('password')">
              {{ escuchandoPassword ? '🛑' : '🎙️' }}
            </button>
          </div>
        </div>

        <p v-if="mensajeError" class="error-text" style="color: red; margin-bottom: 10px;">
          {{ mensajeError }}
        </p>

        <button type="submit" class="btn-submit" :disabled="cargando">
          <span v-if="!cargando">Ingresar al Sistema</span>
          <div v-else class="spinner"></div>
        </button>
      </form>

      <div class="card-footer">
        <p>¿Aún no tiene una cuenta gubernamental?</p>
        <router-link to="/registro" class="register-link">Regístrese aquí</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/CSS/login.css"></style>