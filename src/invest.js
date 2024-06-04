import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import $ from 'jquery'

gsap.registerPlugin(Flip)
// Function to handle "invest" page-specific scripts
export default function handleInvestPage() {
  // Function to handle thumbnail click events
  function handleThumbnailClick(thumbnailsIndex) {
    return function () {
      // Find child images within the same container
      let thumbnails = $('.thumbnails').eq(thumbnailsIndex)
      let childImages = $(this).closest(thumbnails).find('.thumbnails_img')
      const state = Flip.getState(childImages)
      console.log(childImages)
      console.log(state)

      // Find the main image within the container
      let $mainImg = $('.thumbnails_main').eq(thumbnailsIndex).find('img')

      // Move clicked thumbnail image to the main image container
      $(this).find('img').appendTo($('.thumbnails_main').eq(thumbnailsIndex))

      // Move previous main image back to the thumbnail container
      $mainImg.appendTo($(this))

      // Animate the transition using Flip
      Flip.from(state, {
        duration: 1,
        ease: 'power1.inOut',
        absolute: true,
      })
    }
  }

  // Click event for thumbnails in the first container
  $('.thumbnails')
    .eq(0)
    .find('.thumbnails_item')
    .on('click', handleThumbnailClick(0))

  // Click event for thumbnails in the second container
  $('.thumbnails')
    .eq(1)
    .find('.thumbnails_item')
    .on('click', handleThumbnailClick(1))

  // DOWNLOAD BROCHURE
  const formSubmitEvent = (function () {
    const init = ({ onlyWorkOnThisFormName, onSuccess, onFail }) => {
      $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings.url.includes('https://webflow.com/api/v1/form/')) {
          const isSuccessful = xhr.status === 200
          const isWorkOnAllForm = onlyWorkOnThisFormName == undefined
          const isCorrectForm =
            !isWorkOnAllForm &&
            settings.data.includes(getSanitizedFormName(onlyWorkOnThisFormName))

          if (isWorkOnAllForm) {
            if (isSuccessful) {
              onSuccess()
            } else {
              onFail()
            }
          } else if (isCorrectForm) {
            if (isSuccessful) {
              onSuccess()
            } else {
              onFail()
            }
          }
        }
      })
    }

    function getSanitizedFormName(name) {
      return name.replaceAll(' ', '+')
    }
    return {
      init,
    }
  })()

  // Example 1
  formSubmitEvent.init({
    onlyWorkOnThisFormName: 'Popup form - begijnengracht',
    onSuccess: () => {
      console.log("A form with this name 'Email Form' is : Success")
      document.getElementById('brochure-begijn').click()
    },
    onFail: () => {},
  })

  formSubmitEvent.init({
    onlyWorkOnThisFormName: 'Popup form - keizer karelstraat',
    onSuccess: () => {
      console.log("A form with this name 'Email Form' is : Success")
      document.getElementById('brochure-keizer').click()
    },
    onFail: () => {},
  })
}
