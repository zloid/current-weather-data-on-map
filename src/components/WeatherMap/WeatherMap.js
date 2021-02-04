import React, { useEffect } from 'react'
import { Spinner } from '../Spinner/Spinner'
import { useDispatch, useSelector } from 'react-redux'
import {
    MapContainer,
    TileLayer,
    Marker,
    Tooltip,
    LayerGroup,
    Circle,
} from 'react-leaflet'

import {
    fetchWeather,
    finalForwardGeoDataSelector,
    isResultDataLoadedSelector,
    isLoadingSelector,
} from '../../features/mapOfWeather/mapOfWeatherSlice'

/**
 * React functional component
 * @returns {JSX.Element} Map of Poland with the weather of some cities
 */
export const WeatherMap = () => {
    const dispatch = useDispatch()

    const isDataLoading = useSelector(isLoadingSelector)
    const isResultDataLoaded = useSelector(isResultDataLoadedSelector)

    const resultDataOfStationAndWeather = useSelector(
        finalForwardGeoDataSelector
    )

    /**
     * To get different colors depending on the temperature of a particular station
     *
     * @function pickColor
     * @param {string|number} temperature
     * @returns {string} color rely on input temperature
     */
    function pickColor(temperature) {
        temperature = Number(temperature)
        switch (true) {
            case temperature >= 0 && temperature < 1:
                return '#cc6600'
            case temperature >= 1 && temperature < 2:
                return '#ff9980'
            case temperature >= 2 && temperature < 3:
                return '#ffc266'
            case temperature >= 3 && temperature < 5:
                return '#ff9900'
                case temperature >= 5 && temperature < 7:
                return 'gold'
            case temperature >= 7:
                return '#ff5c33'
            case temperature < 0 && temperature > -2:
                return '#80bfff'
            case temperature <= -2 && temperature > -4:
                return '#0066ff'
            case temperature <= -4:
                return 'blue'
            default:
                return 'papayawhip'
        }
    }

    /**
     * For checking: if result data of all station is loaded then doing mapping markers on map with name of stations and temperatures
     *
     * @function signAllStationAsMarkerOnMap
     * @returns {JSX.Element[]}
     */
    function signAllStationAsMarkerOnMap() {
        if (isResultDataLoaded) {
            const filteredValidStation = resultDataOfStationAndWeather.filter(
                (station) => station.name !== undefined
            )

            if (filteredValidStation.length > 0) {
                const allStation = filteredValidStation.map((station) => {
                    return (
                        <LayerGroup key={station.id}>
                            <Marker
                                position={[station.latitude, station.longitude]}
                            >
                                <Tooltip permanent>
                                    {station.name}
                                    <br />
                                    Temperatura: {station.temperatura}°C
                                </Tooltip>
                            </Marker>

                            <Circle
                                center={[station.latitude, station.longitude]}
                                pathOptions={{
                                    color: pickColor(station.temperatura),
                                }}
                                radius={20000}
                            />
                        </LayerGroup>
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
            {isDataLoading ? <Spinner /> : null}
            {console.log(isDataLoading)}
            <div className="mainMap">
                <MapContainer
                    center={[51.9654, 19.0609]}
                    zoom={7}
                    scrollWheelZoom={true}
                >
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
