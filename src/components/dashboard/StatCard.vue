<template>
  <div class="stat-card" :class="[color, textColor]">
    <div class="flex align-items-center">
      <i class="pi mr-2" :class="icon"></i>
      <span class="font-bold">{{ title }}</span>
    </div>
    <div class="value" :class="{ 'text-xl': !small, 'text-lg': small }">
      {{ value }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: {
    type: String,
    default: 'bg-blue-100'
  },
  textColor: {
    type: String,
    default: 'text-blue-800'
  },
  small: Boolean
});
</script>

<style scoped>
.stat-card {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.value {
  font-weight: 700;
  margin-top: 0.5rem;
}
</style>