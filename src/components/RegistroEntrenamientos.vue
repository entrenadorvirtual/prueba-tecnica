<template>
    <form @submit.prevent="handleSubmit" class="form-container">
      <h2>{{ isEditing ? 'Editar Entrenamiento' : 'Registrar Entrenamiento' }}</h2>
      <div class="form-group">
        <label for="fecha">Fecha del entrenamiento:</label>
        <input type="date" id="fecha" v-model="entrenamiento.fecha" required />
      </div>
      <div class="form-group">
        <label for="duracion">Duración (minutos):</label>
        <input type="number" id="duracion" v-model.number="entrenamiento.duracion" required />
      </div>
      <div class="form-group">
        <label for="distancia">Distancia (km):</label>
        <input type="number" step="0.01" id="distancia" v-model.number="entrenamiento.distancia" required />
      </div>
      <button type="submit" class="submit-button">
        {{ isEditing ? 'Actualizar Entrenamiento' : 'Registrar Entrenamiento' }}
      </button>
      <button type="button" v-if="isEditing" @click="cancelEdit" class="cancel-button">Cancelar</button>
    </form>
  </template>
  
  <script setup lang="ts">
  import { reactive, computed, watch } from 'vue'
  import { db } from '../firebase'
  import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
  import type { Entrenamiento } from '../types'
  
  // Definir las props y eventos
  interface Props {
    trainingToEdit: Partial<Entrenamiento>
  }
  const props = defineProps<Props>()
  const emit = defineEmits<{
    (e: 'clearEdit'): void
  }>()
  
  // Objeto reactivo para el entrenamiento
  const entrenamiento = reactive<Entrenamiento>({
    id: '',
    fecha: '',
    duracion: 0,
    distancia: 0
  })
  
  // Computed para saber si se está editando
  const isEditing = computed(() => !!entrenamiento.id)
  
  // Si se recibe un entrenamiento para editar, se cargan sus datos en el formulario
  watch(
    () => props.trainingToEdit,
    (newVal) => {
      if (newVal && newVal.id) {
        entrenamiento.id = newVal.id || ''
        entrenamiento.fecha = newVal.fecha || ''
        entrenamiento.duracion = newVal.duracion || 0
        entrenamiento.distancia = newVal.distancia || 0
      } else {
        entrenamiento.id = ''
        entrenamiento.fecha = ''
        entrenamiento.duracion = 0
        entrenamiento.distancia = 0
      }
    },
    { immediate: true }
  )
  
  // Función para enviar el formulario
  const handleSubmit = async () => {
    try {
      if (isEditing.value) {
        // Actualizar documento existente
        await updateDoc(doc(db, 'entrenamientos', entrenamiento.id!), {
            fecha: entrenamiento.fecha,
            duracion: entrenamiento.duracion,
            distancia: entrenamiento.distancia
        });
        alert('Entrenamiento actualizado exitosamente')
      } else {
        // Registrar nuevo documento
        await addDoc(collection(db, 'entrenamientos'), {
          fecha: entrenamiento.fecha,
          duracion: entrenamiento.duracion,
          distancia: entrenamiento.distancia
        })
        alert('Entrenamiento registrado exitosamente')
      }
      // Reiniciar el formulario y limpiar el estado de edición
      entrenamiento.id = ''
      entrenamiento.fecha = ''
      entrenamiento.duracion = 0
      entrenamiento.distancia = 0
      emit('clearEdit')
    } catch (error) {
      console.error('Error al registrar/actualizar entrenamiento:', error)
    }
  }
  
  const cancelEdit = () => {
    entrenamiento.id = ''
    entrenamiento.fecha = ''
    entrenamiento.duracion = 0
    entrenamiento.distancia = 0
    emit('clearEdit')
  }
  </script>
  
  <style scoped>
  .form-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #f7f7f7;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .form-container h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  .form-group {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
  }
  .form-group label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
  }
  .form-group input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .submit-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: #fff;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
  .submit-button:hover {
    background-color: #0056b3;
  }
  .cancel-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #ccc;
    color: #333;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background-color 0.2s ease-in-out;
  }
  .cancel-button:hover {
    background-color: #aaa;
  }
  </style>
  