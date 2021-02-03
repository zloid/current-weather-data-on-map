import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import {
    fetchWeather,
    finalForwardGeoDataSelector,
    isResultDataLoadedSelector,
} from '../../features/mapOfWeather/mapOfWeatherSlice'

export const WeatherMapTwo = () => {
    const [forwardGeodata] = useState({
        latitude: 51.549566,
        longitude: 23.555343,
        name: 'Włodawa',
        temperature: '-1',
    })

    const isResultDataLoaded = useSelector(isResultDataLoadedSelector)
    const resultDataOfStationAndWeather = useSelector(
        finalForwardGeoDataSelector
    )

    console.log(isResultDataLoaded)

    const dispatch = useDispatch()

    function renderAllExistingStation() {
        if (isResultDataLoaded) {
            console.log(resultDataOfStationAndWeather[0])
            console.log(resultDataOfStationAndWeather[0].name)
            console.log(resultDataOfStationAndWeather[0]?.latitude)
            console.log(resultDataOfStationAndWeather[0]?.longitude)

            return resultDataOfStationAndWeather[0]?.temperatura
        }
        return 'no'
    }

    function signAllStationAsMarkerOnMap() {
        if (isResultDataLoaded) {
            const filteredValidStation = resultDataOfStationAndWeather.filter(
                (station) => station.name !== undefined
            )

            if (filteredValidStation.length > 0) {
                const allStation = filteredValidStation.map((station) => {
                    return (
                        <Marker
                            key={station.id}
                            position={[station.latitude, station.longitude]}
                        >
                            {/* <Popup>{station.name}</Popup> */}

                            <Tooltip permanent>
                                {station.name + ' : ' + station.temperatura}
                            </Tooltip>
                        </Marker>
                    )
                })

                console.log('allStation', allStation)
                return allStation
            }
        }

        return null
    }

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
                {/* 
                <Marker
                    position={[
                        forwardGeodata.latitude,
                        forwardGeodata.longitude,
                    ]}
                >
                    <Popup>{forwardGeodata.name}</Popup>
                    <Tooltip permanent>{renderAllExistingStation()}</Tooltip>
                </Marker> */}

                {signAllStationAsMarkerOnMap()}
            </MapContainer>
        </div>
    )
}
