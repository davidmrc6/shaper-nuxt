<script setup>
/**
 * Defines default layout for web pages.
 * Includes a navigation bar, a footer, and transitions between pages.
 */

/**
 * Transition between pages.
 */
const slideTransition = {
  name: 'page',
  mode: 'out-in',
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-neutral-900 text-white font-parkinsans">
    <!-- Navigation container -->
    <nav class="fixed top-0 left-0 right-0">
      <div class="bg-neutral-900 border-b border-neutral-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo of web application -->
            <h1 class="text-2xl font-bold">
              shaper
            </h1>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-grow pt-16">
      <NuxtPage :transition="slideTransition" />
    </main>

    <!-- Footer -->
    <footer class="border-t border-neutral-800 bg-neutral-900">
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
  transition: all 300ms ease-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
  will-change: transform, opacity;
}

/* Base styles */
:root {
  background-color: #171717;
  min-height: 100vh;
}
</style>
