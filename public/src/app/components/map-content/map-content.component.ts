import { Component, OnInit } from '@angular/core'
import { GoogleMapsAPIWrapper } from '@agm/core'

declare var google: any

@Component({
  selector: 'app-map-content',
  template: '',
})
export class MapContentComponent implements OnInit {

  constructor(public mapApiWrapper: GoogleMapsAPIWrapper) {

  }

  ngOnInit(): void {

    this.mapApiWrapper.getNativeMap()
      .then(map => {
        this.addYourLocationButton(map, undefined)
      })

  }

  addYourLocationButton(map, marker): void {
    console.log(map)
    const controlDiv = document.createElement('div')

    const firstChild = document.createElement('button')
    firstChild.style.backgroundColor = '#fff'
    firstChild.style.border = 'none'
    firstChild.style.outline = 'none'
    firstChild.style.width = '28px'
    firstChild.style.height = '28px'
    firstChild.style.borderRadius = '2px'
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)'
    firstChild.style.cursor = 'pointer'
    firstChild.style.marginRight = '10px'
    firstChild.style.padding = '0'
    firstChild.title = 'Your Location'
    controlDiv.appendChild(firstChild)

    const secondChild = document.createElement('div')
    secondChild.style.margin = '5px'
    secondChild.style.width = '18px'
    secondChild.style.height = '18px'
    // tslint:disable-next-line:max-line-length
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)'
    secondChild.style.backgroundSize = '180px 18px'
    secondChild.style.backgroundPosition = '0 0'
    secondChild.style.backgroundRepeat = 'no-repeat'
    firstChild.appendChild(secondChild)

    // new GoogleMapsAPIWrapper().getNativeMap()
    // google.maps.event.addListener(map, 'center_changed', () => {
    //   secondChild.style['background-position'] = '0 0'
    // })

    firstChild.addEventListener('click', () => {
      let imgX = 0
      const animationInterval = setInterval(() => {
        imgX = -imgX - 18
        secondChild.style['background-position'] = imgX + 'px 0'
      },                                    500)

      if (navigator.geolocation) {
        // this.goToUsersLocation()
        alert('Yo!')
        // map.setCenter()
        // navigator.geolocation.getCurrentPosition(function (position) {
        // tslint:disable-next-line:max-line-length
        //   const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
        //   map.setCenter(latlng)
        //   clearInterval(animationInterval)
        //   secondChild.style['background-position'] = '-144px 0'
        // })
      } else {
        clearInterval(animationInterval)
        secondChild.style['background-position'] = '0 0'
      }
    })

  }

}
