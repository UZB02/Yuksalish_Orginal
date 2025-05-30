<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  monthlyStats: Array
})

const canvasRef = ref(null)

const drawLineChart = () => {
  const canvas = canvasRef.value
  const data = props.monthlyStats

  if (!canvas || !data.length) return

  const ctx = canvas.getContext('2d')
  const { width, height } = canvas

  ctx.clearRect(0, 0, width, height)

  const padding = 60
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding

  const maxSales = Math.max(...data.map((d) => d.totalSales || 0))
  const maxProfit = Math.max(...data.map((d) => d.profit || 0))
  const maxValue = Math.max(maxSales, maxProfit)

  if (maxValue === 0) return

  // Grid lines
  ctx.strokeStyle = '#f3f4f6'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  // Sales line
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 3
  ctx.beginPath()
  data.forEach((point, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const y = padding + chartHeight - ((point.totalSales || 0) / maxValue) * chartHeight
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()

  // Profit line
  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 3
  ctx.beginPath()
  data.forEach((point, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index
    const y = padding + chartHeight - ((point.profit || 0) / maxValue) * chartHeight
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()

  // Points and labels
  ctx.fillStyle = '#374151'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  data.forEach((point, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index

    const salesY = padding + chartHeight - ((point.totalSales || 0) / maxValue) * chartHeight
    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(x, salesY, 4, 0, 2 * Math.PI)
    ctx.fill()

    const profitY = padding + chartHeight - ((point.profit || 0) / maxValue) * chartHeight
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.arc(x, profitY, 4, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = '#6b7280'
    const label = point.month ? `${point.month}-oy` : `${index + 1}`
    ctx.fillText(label, x, height - 20)
  })
}

onMounted(() => {
  drawLineChart()
})

watch(() => props.monthlyStats, () => {
  drawLineChart()
}, { deep: true })
</script>

<template>
  <Card>
    <template #title>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-gray-900">Daromad va foyda dinamikasi</span>
        <div class="flex items-center gap-3">
          <Tag severity="info" value="Daromad" style="background-color: #3b82f6; color: white;" />
          <Tag severity="success" value="Foyda" style="background-color: #10b981; color: white;" />
        </div>
      </div>
    </template>

    <template #content>
      <div class="h-80">
        <canvas ref="canvasRef" class="w-full h-full"></canvas>
      </div>
    </template>
  </Card>
</template>
