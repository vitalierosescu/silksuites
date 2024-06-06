import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Add and remove Navbar active clasds
export const addNavbarActiveClass = () => {
  // Select the navbar
  const navbar = document.querySelector('.navbar_container')

  // Ensure the element exists
  if (!navbar) {
    console.log('Navbar not found')
    return
  }

  // Function to toggle 'is-active' class based on scroll position
  function toggleNavbarClass() {
    if (window.scrollY > 800) {
      navbar.classList.add('is-active')
    } else {
      navbar.classList.remove('is-active')
    }
  }

  // Attach the scroll event listener to the window
  window.addEventListener('scroll', toggleNavbarClass)
}

let initialDirection = false

// Scroll Direction
ScrollTrigger.create({
  trigger: '.page-wrapper',
  start: 'top -800px',
  end: 'bottom bottom',
  onUpdate: (self) => {
    if (self.direction !== self.prevDirection) {
      if (initialDirection === false) {
        initialDirection = true
        self.direction = -1
      }

      gsap.to('.navbar_menu', {
        opacity: `${self.direction === -1 ? '1' : '0'}`,
        y: `${self.direction === -1 ? '0rem' : '-6rem'}`,
        duration: 0.8,
        ease: 'Quart.easeOut',
      })
      gsap.to(
        '.navbar_logo-destination, .navbar_logo-words, .navbar_menu-button',
        {
          opacity: `${self.direction === -1 ? '1' : '0'}`,
          y: `${self.direction === -1 ? '0rem' : '-6rem'}`,
          duration: 0.8,
          ease: 'Quart.easeOut',
        }
      )
      self.prevDirection = self.direction
    }
  },
})
