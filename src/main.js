import gsap from 'gsap'
import { ScrollTrigger, Flip } from 'gsap/all'
import $ from 'jquery'

import animateTitle from './features/animateTitle'
import createBadge from './features/createBasge'
import './styles/style.css'

console.log('Welcome to Vite + JS + Webflow!')

createBadge()
animateTitle()

gsap.registerPlugin(ScrollTrigger, Flip)

let mm = gsap.matchMedia()

// add a media query. When it matches, the associated function will run

mm.add('(min-width: 200px)', () => {
  function addFlip(flipElementClass, destination) {
    let triggerElement = $('.sticky_parent')
    let flipElement = triggerElement.find(flipElementClass)
    const originalParent = flipElement.parent()
    let destinationParent = destination
    let isFlipped = false // Flag to track if the element has been flipped

    let state

    const triggerProgress = 0.75

    // Set up the ScrollTrigger and Flip animation
    ScrollTrigger.create({
      trigger: triggerElement, // The section that will trigger the animation
      start: 'top 80%', // The start point of the animation
      onUpdate: (self) => {
        if (self.progress > triggerProgress && !isFlipped) {
          isFlipped = true
          state = Flip.getState(flipElement)
          destinationParent.append(flipElement)

          // Animate to the new state
          Flip.from(state, {
            duration: 2.5,
            ease: 'Quart.easeOut',
            absolute: true,
          })
        } else if (self.progress <= triggerProgress && isFlipped) {
          isFlipped = false

          state = Flip.getState(flipElement)

          originalParent.append(flipElement)
          console.log('Triggered: Progress <= 0.8')

          Flip.from(state, {
            duration: 1,
            ease: 'Quart.easeInOut',
            absolute: true,
          })
        }
      },
    })
  }

  addFlip('.card_image.is-mouth', $('.outro_face-mouth'))
  addFlip('.card_image.is-eye', $('.outro_face-eye'))
  addFlip('.card_image.is-left', $('.outro_face-left'))
  addFlip('.card_image.is-base', $('.outro_face-base'))
  addFlip('.card_image.is-forehead', $('.outro_face-forehead'))
})
