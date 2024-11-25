<script setup>
/**
 * Defines the canvas onto which shapes are mounted and modified.
 */
defineProps({
  /**
   * Profile of the user currently viewing the canvas.
   */
  profile: Object,
  /**
   * Array of shapes.
   */
  shapes: {
    type: Array,
    required: true,
  },
  /**
   * Checks if user trying to modify the shapes is authorized to do so.
   */
  isOwner: {
    type: Boolean,
    default: false,
  },
})

/**
 * Delete shape event.
 */
const emit = defineEmits(['deleteShape'])

/**
 * Handles shape deletion
 * @param shapeId - Id of the shape to be deleted.
 */
const handleDeleteShape = (shapeId) => {
  emit('deleteShape', shapeId)
}
</script>

<template>
  <div class="w-full py-8">
    <!-- Page Title -->
    <div>
      <h1 class="text-white text-2xl">
        {{ `${profile.username}'s canvas` }}
      </h1>
    </div>

    <!-- Drop Shapes Area -->
    <div class="w-full h-full">
      <DraggableShape
        v-for="shape in shapes"
        :id="shape.id"
        :key="shape.id"
        :user-id="profile.id"
        :initial-x="shape.x"
        :initial-y="shape.y"
        :initial-color="shape.color"
        :initial-size="shape.size"
        :is-owner="isOwner"
        @delete="handleDeleteShape"
      />
    </div>
  </div>
</template>
