import { Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import { WebSocketSubject } from 'rxjs/webSocket';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent  implements OnInit{


  private ws: WebSocketSubject<any>;
  private map: any;
  private marker: any;

  constructor() {
    this.ws = new WebSocketSubject('ws://0.0.0.0:8000/ws_coordinates');
  }

  ngOnInit(): void {
    this.initMap();
    this.subscribeToCoordinates();
  }

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  private subscribeToCoordinates(): void {
    this.ws.subscribe(
      (data: any) => {
        console.log(data);
      // const coordinates = JSON.parse(data);
      const latitude = data[0].latitude;
      const longitude = data[0].longitude;

      // Création ou mise à jour du marqueur
      this.updateMarker(latitude, longitude);

      // Centrer la carte sur le nouveau marqueur
      this.map.setView([latitude, longitude], this.map.getZoom());
      },
      (error: any) => console.error(error),
      () => console.log('WebSocket stream complete')
    );
  }

  private updateMarker(lat: number, lng: number): void {
    if (!this.marker) {
      this.marker = L.marker([lat, lng]).addTo(this.map);
      console.log("marker created");

    } else {
      this.marker.setLatLng([lat, lng]);
      console.log("marker updated");
    }
  }

}
