import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import $ from 'jquery'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger, Flip)
// Function to handle "home" page-specific scripts
export default function handleHomePage() {
  let mm = gsap.matchMedia()

  // store elements
  let visual = $('.loader_logo')
  let visualDestination = $('.navbar_logo-destination')

  // Check for first visit
  if (!localStorage.getItem('firstVisit')) {
    localStorage.setItem('firstVisit', 'true')
    console.log('this is the first visit')
    window.scrollTo(0, 0)
    window.SScroll.call.stop()

    // Hero ENTRANCE Animation
    mm.add('(min-width: 2px)', () => {
      gsap.defaults({ ease: 'Quart.easeInOut', duration: 1 })

      const logoWords = document.querySelectorAll('.is-logo-word svg')

      // move button animation
      function moveVisualInto(element) {
        let state = Flip.getState(visual)
        visual.appendTo(element)
        Flip.from(state, {
          duration: 1.5,
          delay: 0.4,
          onStart: () => {
            gsap.to(logoWords, {
              y: '0%',
              stagger: 0.05,
              delay: 1.2,
              ease: 'Quart.easeOut',
              duration: 0.9,
            })
            setTimeout(function () {
              window.SScroll.call.start()
            }, 650)
          },
        })
      }

      const heroEntrance = () => {
        let heroTl = gsap.timeline()

        heroTl
          .fromTo(
            '.home-hero_video-parent',
            {
              borderRadius: '350px 350px 0 0',
            },
            {
              width: '100%',
              height: '240vh',
              borderRadius: '0 0 0 0',
              duration: 2,
              onStart: () => {
                moveVisualInto(visualDestination)
              },
            }
          )
          .fromTo(
            '.home-hero_content',
            {
              y: '1rem',
            },
            {
              y: '0rem',
              opacity: 1,
              duration: 1.45,
              ease: 'Quart.easeOut',
            },
            '<1.5'
          )
          .fromTo(
            '.navbar_component .is-nav-link',
            {
              opacity: 0,
              y: '0.5rem',
            },
            {
              opacity: 1,
              stagger: 0.15,
              y: '0rem',
            },
            '<'
          )
      }

      heroEntrance()
    })
  } else {
    localStorage.setItem('firstVisit', 'false')
    document
      .querySelector('.home-hero_content')
      .classList.remove('is-first-visit')
    document
      .querySelector('.home-hero_video-parent')
      .classList.remove('is-first-visit')
    document
      .querySelectorAll('.navbar_component .is-nav-link')
      .forEach((link) => (link.style = 'opacity: 1 !important;'))

    let state = Flip.getState(visual)
    visual.appendTo(visualDestination)
    Flip.from(state, {
      duration: 0,
    })

    $('.is-logo-word').each(function () {
      $(this).removeClass('is-first-visit')
    })
    console.log('this is not the first visit')
  }

  // DOUBLE SLIDER
  $('.slider_wrap').each(function () {
    let childArrows = $(this).find('.slider_button')
    let childItems = $(this).find('.slider_item').hide()
    let childDots = $(this).find('.slider_dot-item')
    let totalSlides = childItems.length
    let activeIndex = 0 // 0 because the first slide will be active by default

    childItems.first().css('display', 'flex')

    gsap.set(childDots.eq(0).find('.slider_dot-line'), { x: '0%' })

    // DOT LINES TIMELINE
    let dotsTl = gsap.timeline({ repeat: -1 })
    childDots.each(function (index) {
      dotsTl.addLabel(`step${index}`)
      dotsTl.to($(this).find('.slider_dot-line'), {
        scaleX: '1',
        ease: 'none',
        duration: 4,
        onComplete: () => {
          goNext(index + 1)
        },
      })
    })

    if (childArrows) {
      childArrows.each(function () {
        $(this).css('pointer-events', 'none')
      })
    }

    // MAIN SLIDER CODE
    function moveSlide(nextIndex, forwards) {
      let tl3 = gsap.timeline()
      if (childDots) {
        tl3.set(childDots.eq(nextIndex).find('.slider_dot-line'), { x: '0%' })
        tl3.fromTo(
          childDots.eq(activeIndex).find('.slider_dot-line'),
          { x: '0%' },
          { x: '100%' }
        )
      }

      dotsTl.seek(`step${nextIndex}`)

      childItems.hide()
      let prevItem = childItems.eq(activeIndex).css('display', 'flex')
      let nextItem = childItems.eq(nextIndex).css('display', 'flex')

      let tl = gsap.timeline({
        defaults: { duration: 1.5, ease: 'Quart.easeInOut' },
        onStart: () => {
          if (childArrows) {
            childArrows.each(function () {
              $(this).css('pointer-events', 'none')
            })
          }
        },
        onComplete: () => {
          if (childArrows) {
            childArrows.each(function () {
              $(this).css('pointer-events', 'auto')
            })
          }
        },
      })

      if (forwards) {
        tl.fromTo(
          nextItem,
          { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }
        )
        tl.fromTo(
          prevItem,
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
          {
            clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
          },
          '<'
        )
      } else {
        tl.fromTo(
          nextItem,
          { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }
        )
        tl.fromTo(
          prevItem,
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
          {
            clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
          },
          '<'
        )
      }

      activeIndex = nextIndex
    }

    // ARROWS
    function goNext(num) {
      let nextIndex = num
      if (nextIndex > totalSlides - 1) nextIndex = 0
      moveSlide(nextIndex, true)
    }
    // go next
    if (childArrows) {
      childArrows.filter('.is-next').on('click', function () {
        goNext(activeIndex + 1)
      })
    }
    // go prev
    if (childArrows) {
      childArrows.filter('.is-prev').on('click', function () {
        let nextIndex = activeIndex - 1
        if (nextIndex < 0) nextIndex = totalSlides - 1
        moveSlide(nextIndex, false)
      })
    }

    // CLICK DOTS
    if (childDots) {
      childDots.on('click', function () {
        let dotIndex = $(this).index()
        if (activeIndex > dotIndex) {
          moveSlide(dotIndex, false)
        } else if (activeIndex < dotIndex) {
          moveSlide(dotIndex, true)
        } else {
          // nothing
        }
      })
    }
  })

  // Function to check if the viewport width is 767px or less
  function isMobile() {
    return window.innerWidth <= 767
  }

  const layoutText = new SplitType('.outro-quote_text', {
    types: 'words',
  })
  const layoutTL = gsap.timeline()

  let startValue = isMobile() ? 'top 25%' : 'top 60%'
  let endValue = isMobile() ? 'bottom 90%' : 'bottom 80%'

  layoutTL.from(layoutText.words, {
    // Initial opacity for each word
    opacity: 0.25,
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.section_outro-quote',
      start: startValue,
      end: endValue,
      scrub: 1.5,
    },
  })
}
