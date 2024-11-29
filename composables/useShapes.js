import { useShapesStore } from '~/stores/useShapesStore'

export const useShapes = () => {
  const route = useRoute()
  const shapesStore = useShapesStore()

  const fetchShapes = async () => {
    try {
      const response = await $fetch(`/api/shapes/${route.params.id}`)
      shapesStore.setShapes(response.shapes)
    }
    catch (error) {
      console.error('Failed to fetch shapes:', error)
    }

    return shapesStore.shapes
  }

  const addShape = async () => {
    try {
      const response = await $fetch(`/api/shapes/${route.params.id}`, {
        method: 'POST',
        body: {
          x: 0,
          y: 0,
          color: 'bg-blue-500',
          size: 48,
        },
      })
      shapesStore.addShape(response.shape)
      return response.shape
    }
    catch (error) {
      console.error('Failed to add shape:', error)
      throw error
    }
  }

  const deleteShape = async (shapeId) => {
    try {
      await $fetch(`/api/shapes/${route.params.id}`, {
        method: 'DELETE',
        body: { shapeId },
      })
      shapesStore.removeShape(shapeId)
    }
    catch (error) {
      console.error('Failed to delete shape:', error)
      throw error
    }
  }

  return {
    shapes: computed(() => shapesStore.shapes),
    fetchShapes,
    addShape,
    deleteShape,
  }
}
