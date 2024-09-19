import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const navbarBg = document.querySelector('.navbar_background-light')
// let initialDirection = false

export const addNavbarActiveClass = () => {
  const navbar = document.querySelector('.navbar_container')
  const logoWords = document.querySelectorAll(
    '.navbar_logo-silk, .navbar_logo-suites'
  )
  // const hamburger = document.querySelector('.navbar_menu-button')

  // Ensure the element exists
  if (!navbar) {
    console.log('Navbar not found')
    return
  }

  // Function to toggle 'is-active' class based on scroll position
  function toggleNavbarClass() {
    if (window.scrollY > 80) {
      navbar.classList.add('is-active')
      navbarBg.classList.add('is-active')
      logoWords.forEach((word) => word.classList.add('is-dark'))
    } else {
      navbar.classList.remove('is-active')
      navbarBg.classList.remove('is-active')
      logoWords.forEach((word) => word.classList.remove('is-dark'))
    }
  }

  // Attach the scroll event listener to the window
  window.addEventListener('scroll', toggleNavbarClass)

  // Scroll Direction
  // ScrollTrigger.create({
  //   trigger: '.page-wrapper',
  //   start: 'top -800px',
  //   end: 'bottom bottom',
  //   onUpdate: (self) => {
  //     if (self.direction !== self.prevDirection) {
  //       if (initialDirection === false) {
  //         initialDirection = true
  //         self.direction = -1
  //       }

  //       gsap.to('.navbar_component', {
  //         y: `${self.direction === -1 ? '0%' : '-100%'}`,
  //         duration: 0.5,
  //         ease: 'Quart.easeOut',
  //       })

  //       self.prevDirection = self.direction
  //     }
  //   },
  // })
}
