import { defineStore } from 'pinia'

export const useShapesStore = defineStore('shapes', {
  state: () => ({
    shapes: [],
  }),
  actions: {
    setShapes(shapes) {
      this.shapes = shapes
    },
    addShape(shape) {
      this.shapes.push(shape)
    },
    removeShape(shapeId) {
      this.shapes = this.shapes.filter(shape => shape.id !== shapeId)
    },
  },
})
