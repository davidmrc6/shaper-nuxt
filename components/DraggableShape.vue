<script setup>
const props = defineProps({
  initialX: {
    type: Number,
    default: 0
  },
  initialY: {
    type: Number,
    default: 0
  }
})

const draggableRef = ref(null)
const isDragging = ref(false)
const showMenu = ref(false)
const menuPosition = reactive({ x: 0, y: 0 })

const menuWidth = 208;

const shapeStyle = reactive({
  size: 48,
  color: 'bg-blue-500'
})

const position = reactive({
  x: 0,
  y: 0
})
const offset = reactive({
  x: 0,
  y: 0
})
const initial = reactive({
  x: ref(props.initialX),
  y: ref(props.initialY)
})

const colors = [
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Red', value: 'bg-red-500' },
  { label: 'Green', value: 'bg-green-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Yellow', value: 'bg-yellow-500' },
]

// Start dragging shape
const startDragging = (event) => {
  isDragging.value = true

  const eventX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX
  const eventY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY

  initial.x = eventX - offset.x
  initial.y = eventY - offset.y

  if (event.type === 'mousedown') {
    window.addEventListener('mousemove', drag)
    window.addEventListener('mouseup', stopDragging)
  } else {
    window.addEventListener('touchmove', drag, { passive: false })
    window.addEventListener('touchend', stopDragging)
  }
}

// Drag function
const drag = (event) => {
  if (!isDragging.value) {
    return
  }
  event.preventDefault()

  const eventX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX
  const eventY = event.type === 'mousemove' ? event.clientY : event.touches[0].clientY

  const containerRect = draggableRef.value.parentElement.getBoundingClientRect()
  const draggableRect = draggableRef.value.getBoundingClientRect()

  // Calculate new position
  let newX = eventX - initial.x
  let newY = eventY - initial.y
  // Constrain to container bounds
  newX = Math.max(0, Math.min(newX, containerRect.width - draggableRect.width))
  newY = Math.max(0, Math.min(newY, containerRect.height - draggableRect.height))

  position.x = newX
  position.y = newY
  offset.x = newX
  offset.y = newY
}

// Stop dragging
const stopDragging = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('touchmove', drag)
  window.removeEventListener('touchend', stopDragging)
}

// Handle context menu
const handleContextMenu = (event) => {
  event.preventDefault()
  showMenu.value = true

  // Get viewport dimensions
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Get shape position and dimensions
  const shapeRect = draggableRef.value.getBoundingClientRect()

  // Calculate initial menu position (relative to the shape)
  let x = shapeRect.right + 8 // 8px offset from shape
  let y = shapeRect.top

  // Check if menu would overflow viewport and adjust if necessary
  if (x + menuWidth > viewportWidth) {
    x = shapeRect.left - menuWidth
  }
  if (y + menuWidth > viewportHeight) {
    y = viewportHeight - menuWidth
  }

  menuPosition.x = x
  menuPosition.y = y
}

// Change shape color
const changeColor = (newColor) => {
  shapeStyle.color = newColor
  showMenu.value = false
}

// Update size
const updateSize = (newSize) => {
  shapeStyle.size = newSize
  showMenu.value = false
}

// Close menu when clicking outside
const closeMenu = (event) => {
  if (!event.target.closest('.context-menu') && !event.target.closest('.draggable-shape')) {
    showMenu.value = false
  }
}

// Clean up event listeners
onUnmounted(() => {
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('touchmove', drag)
  window.removeEventListener('touchend', stopDragging)
  window.removeEventListener('click', closeMenu)
})

// Add click outside listener
onMounted(() => {
  window.addEventListener('click', closeMenu)
})
</script>

<template>
  <div
    ref="draggableRef"
    @mousedown="startDragging"
    @touchstart="startDragging"
    @contextmenu="handleContextMenu"
    :style="{
      transform: `translate(${position.x}px, ${position.y}px)`,
      width: `${shapeStyle.size}px`,
      height: `${shapeStyle.size}px`
    }"
    :class="[
      shapeStyle.color,
      'absolute rounded-full cursor-move touch-none select-none draggable-shape'
    ]"
  />

  <!-- Context menu -->
  <div
    v-if="showMenu"
    class="context-menu fixed bg-neutral-900 shadow-lg rounded-lg p-4 z-50 w-52"
    :style="{
      left: `${menuPosition.x}px`,
      top: `${menuPosition.y}px`
    }"
  >
    <div class="mb-4">
      <p class="text-1xl font-bold font-parkinsans text-gray-400 mb-2">color</p>
      <div class="flex gap-2">
        <button
          v-for="color in colors"
          :key="color.value"
          :class="[
            color.value,
            'w-6 h-6 rounded-full hover:opacity-80 transition-opacity',
            shapeStyle.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
          ]"
          @click="changeColor(color.value)"
        />
      </div>
    </div>

    <div>
      <p class="text-1xl font-bold font-parkinsans text-gray-400 mb-2">size</p>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="size in [24, 48, 72, 96]"
          :key="size"
          :class="[
            'font-parkinsans text-1xl text-gray-400 hover:text-white transition-all duration-200',
            shapeStyle.size === size ? 'text-white font-bold  ' : ''
          ]"
          @click="updateSize(size)"
        >
          {{ size }}px
        </button>
      </div>
    </div>
  </div>
</template>
