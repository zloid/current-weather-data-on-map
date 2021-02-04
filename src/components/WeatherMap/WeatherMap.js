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

export const WeatherMap = () => {
    const dispatch = useDispatch()

    const isDataLoading = useSelector(isLoadingSelector)
    const isResultDataLoaded = useSelector(isResultDataLoadedSelector)

    const resultDataOfStationAndWeather = useSelector(
        finalForwardGeoDataSelector
    )

    /**
     * For getting temperature color on map
     *
     * @function pickColor
     * @param {string} temperature
     * @returns {string} color rely by input temperature
     */
    function pickColor(temperature) {
        temperature = Number(temperature)
        switch (true) {
            case temperature >= 0 && temperature <= 2:
                return '#ff9900'
            case temperature > 2 && temperature < 10:
                return 'red'
            case temperature < 0 && temperature >= -2:
                return '#0066ff'
            case temperature < -2 && temperature >= -10:
                return 'blue'
        }
    }

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
                                    /* station.temperatura > 0
                                            ? '#ff9900'
                                            : '#0066ff', */
                                }}
                                // radius={station.temperatura > 0 ? station.temperatura * 15000 : station.temperatura * 15000 * -1}
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
