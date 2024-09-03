function openPopup() {
  const bookingButtons = [
    ...document.querySelectorAll('.guesty-search-submit-btn'),
  ]

  bookingButtons.forEach((bookingButton) => {
    bookingButton.style = 'pointer-events: none;'

    const bookingButtonParent = bookingButton.parentElement
    bookingButtonParent.style = 'position:relative;'

    const linkCover = document.createElement('div')
    linkCover.style =
      'position: absolute; width: 100%; height: 100%;left:0; top: 0; z-index:2; cursor:pointer;'

    bookingButtonParent.appendChild(linkCover)

    linkCover.addEventListener('click', (e) => {
      e.preventDefault()
      document.getElementById('nav-secondary').click()
    })
  })
}

export default openPopup
