import { createSlice } from '@reduxjs/toolkit'

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
        getWeatherSuccess(state, { payload }) {
            state.weatherData = payload
            state.loading = false
            state.hasErrors = false
        },
        getWeatherFailure(state) {
            state.loading = false
            state.hasErrors = true
        },
        pullForwardGeoDataForMap(state, { payload }) {
            state.resultDataForMap = payload
        },
        getFinalForwardGeoDataAndTemperature(state) {
            const { weatherData, resultDataForMap } = state

            const newArrayOfResultObject = weatherData.map((_, key) => {
                const obj = {}

                obj.id = weatherData[key]?.id_stacji
                obj.name = resultDataForMap[key]?.name
                obj.latitude = resultDataForMap[key]?.latitude
                obj.longitude = resultDataForMap[key]?.longitude
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

// selectors
export const isResultDataLoadedSelector = (state) => state.mapOfWeatherReducer.isResultDataLoaded
// export const weatherSelector = (state) => state.mapOfWeatherReducer
export const finalForwardGeoDataSelector = (state) =>
    state.mapOfWeatherReducer.finalForwardGeoData

// actions
export const {
    getWeather,
    getWeatherSuccess,
    getWeatherFailure,
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

            dispatch(getWeatherSuccess(allStationWithWeather))

            // forward geocoding by city name
            // preparing data for Promise.all
            let promisesOfForwardGeo = []

            for (let i = 0; i < allStationWithWeather.length; i++) {
                promisesOfForwardGeo.push(
                    fetch(
                        `http://api.positionstack.com/v1/forward?access_key=358c451c8bc4c40048fd777aa721ad30&query=1600%${allStationWithWeather[i].stacja}`
                    )
                )
            }

            promisesOfForwardGeo = promisesOfForwardGeo.map((promise, key) =>
                promise
                    .then((resolve) => resolve.json())
                    .then((geoData) => {
                        return geoData.data[0]
                    })
            )

            Promise.all(promisesOfForwardGeo)
                .then((response) => {
                    dispatch(pullForwardGeoDataForMap(response))

                    dispatch(getFinalForwardGeoDataAndTemperature())

                    dispatch(checkIsResultDataLoaded())
                })
                .catch(() => alert('Some problem, please reload page!'))
        } catch (error) {
            dispatch(getWeatherFailure())
            alert('Some problem, please reload page!')
        }
    }
}
