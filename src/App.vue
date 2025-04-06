<template>
  <div id="app">
    <RegistroEntrenamientos :trainingToEdit="trainingToEdit" @clearEdit="clearTrainingEdit" />
    <HistorialEntrenamientos @editTraining="handleEditTraining" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RegistroEntrenamientos from './components/RegistroEntrenamientos.vue'
import HistorialEntrenamientos from './components/HistorialEntrenamientos.vue'
import type { Entrenamiento } from './types'

const trainingToEdit = ref<Partial<Entrenamiento>>({})

const handleEditTraining = (training: Entrenamiento) => {
  trainingToEdit.value = { ...training }
}

const clearTrainingEdit = () => {
  trainingToEdit.value = {}
}
</script>

<style>
/* Puedes agregar estilos globales aquí si lo requieres */
</style>
