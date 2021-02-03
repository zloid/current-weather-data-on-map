import React, { useState, useEffect } from 'react'

import { useDispatch, 
    // useSelector
 } from 'react-redux'

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import {
    fetchWeather,
    // weatherSelector,
} from '../../features/mapOfWeather/mapOfWeatherSlice'

export const WeatherMapTwo = () => {
    const [forwardGeodata] = useState({
        latitude: 51.549566,
        longitude: 23.555343,
        name: 'Włodawa',
        temperature: '-1',
    })

    const dispatch = useDispatch()

    // const mapOfWeatherReducer = useSelector(weatherSelector)
/* 
    function renderStacja() {
        if (mapOfWeatherReducer.someData) {
            console.log('mdk: ', mapOfWeatherReducer.someData)

            return mapOfWeatherReducer.someData
        }

        return ''
    }
 */

    // dispatch thunk when component first mounts
    useEffect(() => {
        dispatch(fetchWeather())
    }, [dispatch])

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
                    {/* <Tooltip permanent>{forwardGeodata.temperature}</Tooltip> */}
                    <Tooltip permanent>{/* renderStacja() */}</Tooltip>
                </Marker>
            </MapContainer>
        </div>
    )
}
