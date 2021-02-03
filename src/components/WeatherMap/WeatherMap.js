import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'

export const WeatherMap = () => {
    const [forwardGeodata] = useState({
        latitude: 51.549566,
        longitude: 23.555343,
        name: 'Włodawa',
    })

    const loadWeatherData = async () => {
        try {
            const result = await fetch(
                'https://danepubliczne.imgw.pl/api/data/synop/'
            )

            const data = await result.json()

            // const cityNames = data.map((weatherData) => ({stac: weatherData.stacja, temp: weatherData.temperatura}))
            const cityNames = data.map((weatherData) => [
                weatherData.stacja,
                weatherData.temperatura,
            ])
            // const cityNames = data

            console.log(cityNames)
/* 
            const getForwardGeocod = await fetch(
                `http://api.positionstack.com/v1/forward?access_key=358c451c8bc4c40048fd777aa721ad30&query=1600%${
                    cityNames[Math.floor(Math.random() * cityNames.length)]
                }`
            )

            const getForwardGeocodJSON = await getForwardGeocod.json()

            // obj
            const resultForwardGeocodForMap = getForwardGeocodJSON.data[0]

            console.log(
                'resultForwardGeocodForMap :',
                resultForwardGeocodForMap
            )

            console.log('forwardGeodata: ', forwardGeodata)
            if (typeof resultForwardGeocodForMap === 'object') {
                setforwardGeodata(resultForwardGeocodForMap)
            }
            
            */
           //todo
            // setforwardGeodata({
            //     county: 'Łomżyński',
            //     label: 'Mikolajki, Poland',
            //     latitude: 53.13359,
            //     locality: 'Mikolajki',
            //     longitude: 21.97437,
            //     name: 'Mikolajki',
            // })

            console.log('forwardGeodata: ', forwardGeodata)
        } catch (error) {
            console.log('there has been an error')
            alert('errrrrrr')
        }
    }

    useEffect(() => {
        loadWeatherData()
    }, [])

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

                <Marker
                    position={[
                        forwardGeodata.latitude,
                        forwardGeodata.longitude,
                    ]}
                >
                    <Popup>{forwardGeodata.name}</Popup>
                    <Tooltip permanent>{forwardGeodata.name}</Tooltip>
                </Marker>
                {/* 
                {Array(1)
                    .fill()
                    .map((e, k) => {
                        return (
                            <Marker
                                key={k}
                                position={[
                                    Math.floor(Math.random() * 50),
                                    Math.floor(Math.random() * 20),
                                ]}
                            >
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily
                                    customizable.
                                </Popup>
                            </Marker>
                        )
                    })} */}
            </MapContainer>
        </div>
    )
}
