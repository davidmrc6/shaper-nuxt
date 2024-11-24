<script setup>
import DraggableShape from './DraggableShape.vue';

const props = defineProps({
  profile: Object,
  shapes: {
    type: Array,
    required: true
  }
})
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
        :initial-x="shape.x"
        :initial-y="shape.y"
      />
   </div>
</div>
</template>
