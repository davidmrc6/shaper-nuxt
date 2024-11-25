<script setup>
import DraggableShape from './DraggableShape.vue';

const props = defineProps({
  profile: Object,
  shapes: {
    type: Array,
    required: true
  },
  isOwner: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['deleteShape'])

const handleDeleteShape = (shapeId) => {
  emit('deleteShape', shapeId)
}
</script>

<template>
<div class="w-full py-8">
  <!-- Page Title -->
  <div>
    <h1 class="text-white text-2xl">{{ `${profile.username}'s canvas` }}</h1>
  </div>

  <!-- Drop Shapes Area -->
   <div class="w-full h-full">
    <DraggableShape
        v-for="shape in shapes"
        :key="shape.id"
        :id="shape.id"
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
