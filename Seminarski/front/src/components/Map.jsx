import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function Map() {
  const position = [44.80420055264178, 20.481536799999997];

  const handleNavigation = () => {
    const url = `https://www.google.com/maps?q=${position[0]},${position[1]}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-300 shadow-lg">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="h-[500px] w-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position} icon={DefaultIcon}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">Pub "Oblak u Pantalonama"</h3>
              <p className="text-sm mb-3">Klikni ispod za navigaciju:</p>
              <button
                onClick={handleNavigation}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
              >
                Otvori u Google Maps
              </button>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
