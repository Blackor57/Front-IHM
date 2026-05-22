<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const cargando = ref(false)

const escuchandoEmail = ref(false)
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
  hablarTexto('Inicio de sesión. Por favor, ingresa tus credenciales de acceso seguro.')
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

  if (campo === 'email') escuchandoEmail.value = true
  if (campo === 'password') escuchandoPassword.value = true

  recognition.onresult = (event) => {
    let textoEscuchado = event.results[0][0].transcript
    if (campo === 'email') {
      email.value = textoEscuchado.toLowerCase().replace(/\s+/g, '').replace('arroba', '@')
    }
    if (campo === 'password') {
      password.value = textoEscuchado.replace(/\s+/g, '')
    }
  }

  recognition.onend = () => {
    escuchandoEmail.value = false
    escuchandoPassword.value = false
  }
}

const handleLogin = () => {
  cargando.value = true
  
  // 🔥 DINAMISMO: Si puso un correo, extraemos el usuario para el saludo, si no dejamos uno por defecto
  const nombreSimulado = email.value ? email.value.split('@')[0].toUpperCase() : 'CIUDADANO'
  localStorage.setItem('nombreCiudadano', nombreSimulado)

  setTimeout(() => {
    router.push('/panel-consultas')
  }, 1200)
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
          <label for="email">Correo Electrónico</label>
          <div class="field-wrapper" :class="{ 'is-listening': escuchandoEmail }">
            <span class="field-icon">✉️</span>
            <input id="email" type="email" v-model="email" placeholder="ejemplo@correo.com" required />
            <button type="button" class="mic-btn" :class="{ 'pulse-animation': escuchandoEmail }" @click="dictarCampo('email')">
              {{ escuchandoEmail ? '🛑' : '🎙️' }}
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

        <div class="form-options">
          <a href="#" class="forgot-link">¿Olvidó su contraseña?</a>
        </div>

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