<script setup>
/**
 * Defines a shape which is draggable and changeable by the user.
 */
const props = defineProps({
  /**
   * Initial x-coordinate of the shape.
   */
  initialX: {
    type: Number,
    default: 0,
  },
  /**
   * Initial y-coordinate of the shape.
   */
  initialY: {
    type: Number,
    default: 0,
  },
  /**
   * Id of the shape.
   */
  id: {
    type: Number,
    required: true,
  },
  /**
   * Id of the user adding (or modifying) the shape.
   */
  userId: Number,
  /**
   * Initial color of the shape.
   */
  initialColor: String,
  /**
   * Initial size of the shape.
   */
  initialSize: Number,
  /**
   * Checks whether the user modifying the shape is authorized to do so.
   */
  isOwner: {
    type: Boolean,
    default: false,
  },
})

/**
 * Delete and update events.
 */
const emit = defineEmits(['delete', 'update'])

const draggableRef = ref(null)
const isDragging = ref(false)
const showMenu = ref(false)
const menuPosition = reactive({ x: 0, y: 0 })

const menuWidth = 208

const sizesArray = [12, 24, 48, 72, 96, 128]

const shapeStyle = reactive({
  size: props.initialSize || 48,
  color: props.initialColor || 'bg-blue-500',
})

const position = reactive({
  x: props.initialX || 0,
  y: props.initialY || 0,
})

const offset = reactive({
  x: props.initialX || 0,
  y: props.initialY || 0,
})

const initial = reactive({
  x: props.initialX,
  y: props.initialY,
})

const colors = [
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Red', value: 'bg-red-500' },
  { label: 'Green', value: 'bg-green-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Yellow', value: 'bg-yellow-500' },
]

/**
 * Saves current position of the shape.
 * Then, updates the database.
 */
const savePosition = async () => {
  try {
    await $fetch(`/api/shapes/${props.userId}`, {
      method: 'PUT',
      body: {
        shapeId: props.id,
        x: position.x,
        y: position.y,
        color: shapeStyle.color,
        size: shapeStyle.size,
      },
    })
  }
  catch (error) {
    console.error('Failed to save shape position:', error)
  }
}

/**
 * Start dragging the shape around the ShapeCanvas.
 * @param event - Mouse event triggered by the user.
 */
const startDragging = (event) => {
  if (!props.isOwner) return

  isDragging.value = true

  const eventX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX
  const eventY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY

  initial.x = eventX - offset.x
  initial.y = eventY - offset.y

  if (event.type === 'mousedown') {
    window.addEventListener('mousemove', drag)
    window.addEventListener('mouseup', stopDragging)
  }
  else {
    window.addEventListener('touchmove', drag, { passive: false })
    window.addEventListener('touchend', stopDragging)
  }
}

/**
 * Update the position of the shape while dragging the shape around.
 * @param event - Mouse event triggered by the user.
 */
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

/**
 * Stop dragging the shape.
 * After all event listeners are removed, the position gets saved to the database.
 */
const stopDragging = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('touchmove', drag)
  window.removeEventListener('touchend', stopDragging)
  savePosition()
}

/**
 * Handles context menu.
 * @param event - Mouse event triggered by the user. In this case, it is used to prevent
 * the default action when the user right clicks.
 */
const handleContextMenu = (event) => {
  if (!props.isOwner) return

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

  // Update menu positions
  menuPosition.x = x
  menuPosition.y = y
}

/**
 * Change the color of a shape.
 * This option is available in the context menu.
 * After changing color, save the modified shape to the database.
 * @param newColor - Color to change the shape to.
 */
const changeColor = async (newColor) => {
  shapeStyle.color = newColor
  showMenu.value = false
  await savePosition()
}

/**
 * Update the size of a shape.
 * This option is available in the context menu.
 * After changing color, save the modified shape to the database.
 * @param newSize - Size to update the shape to.
 */
const updateSize = async (newSize) => {
  shapeStyle.size = newSize
  showMenu.value = false
  await savePosition()
}

/**
 * Deletes a shape from the canvas.
 * Emits the 'delete' event back to the parent component.
 * Hides the context menu on deletion of the shape.
 */
const deleteShape = () => {
  emit('delete', props.id)
  showMenu.value = false
}

/**
 * Closes context menu when user clicks outside of it.
 * @param event - Mouse event triggered by the user.
 */
const closeMenu = (event) => {
  if (!event.target.closest('.context-menu') && !event.target.closest('.draggable-shape')) {
    showMenu.value = false
  }
}

/**
 * Cleans up event listeners added to the window object when the component is unmounted.
 */
onUnmounted(() => {
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('touchmove', drag)
  window.removeEventListener('touchend', stopDragging)
  window.removeEventListener('click', closeMenu)
})

/**
 * Add `click` event listener to the window object when the component is mounted.
 */
onMounted(() => {
  window.addEventListener('click', closeMenu)
})
</script>

<template>
  <!--
    Div containing the shape to be dragged and modified.
  -->
  <div
    ref="draggableRef"
    :style="{
      transform: `translate(${position.x}px, ${position.y}px)`,
      width: `${shapeStyle.size}px`,
      height: `${shapeStyle.size}px`,
    }"
    :class="[
      shapeStyle.color,
      'absolute rounded-full select-none',
      { 'cursor-move touch-none': isOwner, 'cursor-default': !isOwner },
    ]"
    @mousedown="startDragging"
    @touchstart="startDragging"
    @contextmenu="handleContextMenu"
  />

  <!-- Context menu -->
  <div
    v-if="showMenu && isOwner"
    class="context-menu fixed bg-neutral-900 shadow-lg rounded-lg p-4 z-50 w-52"
    :style="{
      left: `${menuPosition.x}px`,
      top: `${menuPosition.y}px`,
    }"
  >
    <div class="mb-4">
      <p class="text-1xl font-bold font-parkinsans text-gray-400 mb-2">
        color
      </p>
      <div class="flex gap-2">
        <button
          v-for="color in colors"
          :key="color.value"
          :class="[
            color.value,
            'w-6 h-6 rounded-full hover:opacity-80 transition-opacity',
            shapeStyle.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : '',
          ]"
          @click="changeColor(color.value)"
        />
      </div>
    </div>

    <div class="mb-4">
      <p class="text-1xl font-bold font-parkinsans text-gray-400 mb-2">
        size
      </p>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="size in sizesArray"
          :key="size"
          :class="[
            'font-parkinsans text-1xl text-gray-400 hover:text-white transition-all duration-200',
            shapeStyle.size === size ? 'text-white font-bold' : '',
          ]"
          @click="updateSize(size)"
        >
          {{ size }}px
        </button>
      </div>
    </div>
    <div>
      <button
        class="w-full text-left text-1xl font-parkinsans text-red-500 hover:text-red-400 transition-all duration-200"
        @click="deleteShape"
      >
        delete shape
      </button>
    </div>
  </div>
</template>
