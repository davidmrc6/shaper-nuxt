<script setup>
const props = defineProps({
  profile: Object,
})
</script>

<template>
<div class="py-8">
  <h1 class="text-white text-2xl">{{ `${profile.username}'s canvas` }}</h1>
</div>
</template>
