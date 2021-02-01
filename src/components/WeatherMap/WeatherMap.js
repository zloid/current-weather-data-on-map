import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export const WeatherMap = () => {
    return (
        <div className="mainMap">
            <MapContainer
                center={[51.9654, 19.0609]}
                zoom={7}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[51.505, 19.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
