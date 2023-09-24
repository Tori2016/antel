<script setup lang="ts">
const {
  submitted,
  alarmForm,
  selectVariable,
  conditions,
  v$,
  resetForm,
  widgets,
  handleNewAlarm,
} = useAlarms();
</script>
<template>
  <div class="col-sm-12">
    <div class="card">
      <div class="d-flex gap-3 card-header">
        <h5 class="m-0 text-center text-sm-start">Agregar Alarmas</h5>
      </div>
      <div class="card-body">
        <div class="row g-3 mb-3">
          <div class="col-lg-3 col-md-6 col-sm-6">
            <label class="form-label">Variable</label>
            <multiselect
              class="multiselect-custom"
              v-model="selectVariable"
              :options="widgets"
              track-by="variable"
              label="variableFullName"
              placeholder="Seleccionar variable"
              selectedLabel="Seleccionada"
              selectLabel="Seleccionar"
              deselectLabel="Remover"
            >
            </multiselect>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6">
            <FormSelect
              v-model="alarmForm.condition"
              placeholder="Seleccionar Condición"
              forId="usercondition"
              labelInput="Condición"
              :options="conditions"
              :validate="v$.condition.$error"
            />
            <div
              v-if="submitted && v$.condition.$error"
              class="invalid-feedback"
            >
              <span v-if="v$.condition.required.$invalid">
                El campo es requerido.
              </span>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6">
            <FormInput
              v-model.number="alarmForm.setPoint"
              type="number"
              label="Set Point"
              forId="alarmPoint"
              :validate="v$.setPoint.$error"
            />
            <div
              v-if="submitted && v$.setPoint.$error"
              class="invalid-feedback"
            >
              <span v-if="v$.setPoint.required.$invalid">
                El campo es requerido.
              </span>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6">
            <FormInput
              v-model.number="alarmForm.triggerTime"
              type="number"
              label="Trigger Time(min)"
              forId="triggerTimeAlarm"
              min="1"
              :validate="v$.triggerTime.$error"
            />
            <div
              v-if="submitted && v$.triggerTime.$error"
              class="invalid-feedback"
            >
              <span v-if="v$.triggerTime.required.$invalid">
                El campo es requerido.
              </span>
              <span v-if="v$.triggerTime.minValue.$invalid">
                El valor mínimo es 1 minuto.
              </span>
            </div>
          </div>
        </div>
        <button @click="handleNewAlarm" class="btn btn-primary me-3 mt-3">
          Agregar
        </button>
        <button @click="resetForm" class="btn btn-secondary mt-3">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
