import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import { Spinner } from '../Spinner/Spinner'

import {
    fetchWeather,
    finalForwardGeoDataSelector,
    isResultDataLoadedSelector,
    isLoadingSelector,
} from '../../features/mapOfWeather/mapOfWeatherSlice'

export const WeatherMap = () => {
    // boolean
    const isResultDataLoaded = useSelector(isResultDataLoadedSelector)
    const isDataLoading = useSelector(isLoadingSelector)
    const resultDataOfStationAndWeather = useSelector(
        finalForwardGeoDataSelector
    )

    const dispatch = useDispatch()

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
                            <Tooltip permanent>
                                {station.name}
                                <br />
                                Temperatura: {station.temperatura}°C
                            </Tooltip>
                        </Marker>
                    )
                })

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
        <>
            <div className="mainMap">
                <MapContainer
                    center={[51.9654, 19.0609]}
                    zoom={7}
                    scrollWheelZoom={true}
                >
                    {isDataLoading ? <Spinner /> : null}

                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {signAllStationAsMarkerOnMap()}
                </MapContainer>
            </div>
        </>
    )
}
