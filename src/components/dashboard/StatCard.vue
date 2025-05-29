<template>
  <div class="stat-card" :class="[color, textColor ? textColor : 'text-white']">
    <div class="flex align-items-center justify-content-between">
      <div>
        <div class="text-sm font-medium mb-1">{{ title }}</div>
        <div class="text-2xl font-bold">{{ value }}</div>
      </div>
      <div class="p-3 rounded-full bg-white bg-opacity-10">
        <i :class="icon" class="text-xl"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: String,
  textColor: String,
  small: Boolean
});
</script>

<style scoped>
.stat-card {
  padding: 1rem;
  border-radius: 0.5rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-2xl {
  font-size: 1.5rem;
}
</style>