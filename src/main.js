import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { addNavbarActiveClass } from './global.js'
import handleHomePage from './home.js'
import handleInvestPage from './invest.js'

addNavbarActiveClass()
gsap.registerPlugin(Flip, ScrollTrigger)

// Main function to determine which scripts to run
function main() {
  const pageWrapper = document.querySelector('.page-wrapper')

  if (pageWrapper.classList.contains('home')) {
    handleHomePage()
  } else if (pageWrapper.classList.contains('invest')) {
    handleInvestPage()
  }
}

// Execute main function
main()
