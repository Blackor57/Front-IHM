<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api.js' // <- Importamos el servicio

const router = useRouter()
const dni = ref('') // <- Cambiado a DNI según especificación del backend
const nombreCompleto = ref('') // Lo mantenemos solo para guardar el saludo localmente
const correoElectronico = ref('') // Opcional para el registro según tu JSON original
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

const procesarRegistro = async () => {
  if (!dni.value || !contrasena.value || !nombreCompleto.value) {
    mensajeFeedback.value = 'Por favor, complete todos los campos requeridos.'
    hablarTexto(mensajeFeedback.value)
    return
  }

  cargandoReniec.value = true
  mensajeFeedback.value = 'Validando sus datos de identidad ante el servicio de RENIEC y registrando...'
  hablarTexto(mensajeFeedback.value)

  try {
    // Conexión real enviando dni y password como pide el backend
    await authService.register({
      dni: dni.value,
      password: contrasena.value
    })

    cargandoReniec.value = false
    mensajeFeedback.value = 'Registro exitoso. Identidad verificada correctamente.'
    hablarTexto(mensajeFeedback.value)

    localStorage.setItem('nombreCiudadano', nombreCompleto.value)

    setTimeout(() => {
      router.push('/login') // Redirigimos al login para que obtenga su token seguro
    }, 1500)

  } catch (error) {
    cargandoReniec.value = false
    mensajeFeedback.value = error.response?.data?.message || 'Error en el registro. Verifique sus datos.'
    hablarTexto(mensajeFeedback.value)
  }
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
        <!-- Input de DNI agregado para cumplir con el Backend -->
        <div class="input-wrapper">
          <input type="text" v-model="dni" placeholder="Número de DNI" aria-label="Número de DNI" maxlength="8" />
          <button type="button" class="icon-btn" @click="hablarTexto('Campo DNI')">🆔</button>
        </div>

        <div class="input-wrapper">
          <input type="text" v-model="nombreCompleto" placeholder="Nombre Completo" aria-label="Nombre Completo" />
          <button type="button" class="icon-btn" @click="hablarTexto('Campo Nombre Completo')">🔊</button>
        </div>

        <div class="input-wrapper">
          <input type="email" v-model="correoElectronico" placeholder="Correo Electrónico (Opcional)" aria-label="Correo Electrónico" />
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