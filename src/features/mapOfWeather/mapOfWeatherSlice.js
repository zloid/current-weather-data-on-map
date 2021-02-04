import { createSlice } from '@reduxjs/toolkit'

/**
 * Result shape of one station
 * @typedef {Object} FinalGeoData
 * @property {string} id
 * @property {string=} name
 * @property {number=} latitude
 * @property {number=} longitude
 * @property {string} temperatura
 */

const initialState = {
    loading: false,
    hasErrors: false,
    isResultDataLoaded: false,
    weatherData: [],
    resultDataForMap: [],
    finalForwardGeoData: [],
}

const mapOfWeatherSlice = createSlice({
    name: 'currentTemperature',
    initialState,
    reducers: {
        getWeather(state) {
            state.loading = true
        },
        getWeatherSuccess(state) {
            state.loading = false
            state.hasErrors = false
        },
        getWeatherFailure(state) {
            state.loading = false
            state.hasErrors = true
        },
        getWeatherData(state, { payload }) {
            state.weatherData = payload
        },
        pullForwardGeoDataForMap(state, { payload }) {
            state.resultDataForMap = payload
        },
        getFinalForwardGeoDataAndTemperature(state) {
            const { weatherData, resultDataForMap } = state

            /**@type {FinalGeoData[]} */
            const newArrayOfResultObject = weatherData.map((_, key) => {
                const obj = {}

                obj.id = weatherData[key]?.id_stacji
                obj.name = resultDataForMap[key]?.components.administrative
                obj.latitude = resultDataForMap[key]?.geometry.lat
                obj.longitude = resultDataForMap[key]?.geometry.lng
                obj.temperatura = weatherData[key]?.temperatura

                return obj
            })

            state.finalForwardGeoData = newArrayOfResultObject
        },
        checkIsResultDataLoaded(state) {
            state.isResultDataLoaded = true
        },
    },
})

/**
 * Selector
 * @param {object} state - global State
 * @returns {boolean}
 */
export const isLoadingSelector = (state) => state.mapOfWeatherReducer.loading
/**
 * Selector
 * @param {object} state - global State
 * @returns {boolean}
 */
export const isResultDataLoadedSelector = (state) =>
    state.mapOfWeatherReducer.isResultDataLoaded
/**
 * Selector
 * @param {object} state - global State
 * @returns {FinalGeoData[]}
 */
export const finalForwardGeoDataSelector = (state) =>
    state.mapOfWeatherReducer.finalForwardGeoData

// actions
export const {
    getWeather,
    getWeatherSuccess,
    getWeatherFailure,
    getWeatherData,
    pullForwardGeoDataForMap,
    getFinalForwardGeoDataAndTemperature,
    checkIsResultDataLoaded,
} = mapOfWeatherSlice.actions

// main reducer
export default mapOfWeatherSlice.reducer

// asynchronous thunk action
export function fetchWeather() {
    return async (dispatch) => {
        dispatch(getWeather())

        try {
            // get all stations with own weather data
            const response = await fetch(
                'https://danepubliczne.imgw.pl/api/data/synop/'
            )
            const allStationWithWeather = await response.json()

            dispatch(getWeatherData(allStationWithWeather))

            // forward geocoding by city name
            // preparing data for Promise.all
            let promisesOfForwardGeo = []

            for (let i = 0; i < allStationWithWeather.length; i++) {
                promisesOfForwardGeo.push(
                    // fetch(
                    //     `http://api.positionstack.com/v1/forward?access_key=358c451c8bc4c40048fd777aa721ad30&query=1600%${allStationWithWeather[i].stacja}`
                    // )
                    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${allStationWithWeather[i].stacja}&key=384e118920984d548792d048d5ed3497`)
                )
            }

            promisesOfForwardGeo = promisesOfForwardGeo.map((promise) =>
                promise
                    .then((resolve) => resolve.json())
                    .then((geoData) => {
                        return geoData.results[0]
                    })
            )

            Promise.all(promisesOfForwardGeo)
                .then((response) => {
                    dispatch(pullForwardGeoDataForMap(response))

                    dispatch(getFinalForwardGeoDataAndTemperature())

                    dispatch(getWeatherSuccess())

                    dispatch(checkIsResultDataLoaded())
                })
                .catch(() => alert('Some problem, please reload page!'))
        } catch (error) {
            dispatch(getWeatherFailure())
            alert('Some problem, please reload page!')
        }
    }
}
