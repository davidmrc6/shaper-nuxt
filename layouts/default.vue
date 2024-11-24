<script setup>
const slideTransition = {
  name: 'page',
  mode: 'out-in'
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-neutral-900 text-white font-parkinsans antialiased overflow-x-hidden">
    <!-- Navigation container -->
    <nav class="fixed top-0 left-0 right-0 w-full z-50">
      <div class="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800 -z-10" />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <h1 class="text-2xl font-bold">
            shaper
          </h1>
        </div>
      </div>
    </nav>

    <!-- Main content with padding for fixed nav -->
    <main class="flex-grow pt-16">
      <!-- Page transition wrapper -->
      <NuxtPage :transition="slideTransition" />
    </main>

    <!-- Footer -->
    <footer class="border-t border-neutral-800 w-full bg-neutral-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p class="text-center text-neutral-500">
          created by David Mereacre.
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  @apply transition-all duration-300 ease-out will-change-transform;
}

.page-enter-from {
  @apply opacity-0 translate-y-2;
}

.page-leave-to {
  @apply opacity-0 -translate-y-2;
}

html,
body {
  @apply bg-neutral-900 min-h-screen overflow-x-hidden;
}
</style>
