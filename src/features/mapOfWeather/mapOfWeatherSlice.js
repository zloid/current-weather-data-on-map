import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    hasErrors: false,
    weatherData: [],
    someData: '',
    resultDataForMap: [],
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
        pullResultDataForMap(state, { payload }) {
            state.resultDataForMap.push(payload)
        },
        someReducer(state, { payload }) {
            state.someData = payload
        },
    },
})

// selector
export const weatherSelector = (state) => state.mapOfWeatherReducer

// actions
export const {
    getWeather,
    getWeatherSuccess,
    getWeatherFailure,
    pullResultDataForMap,
    someReducer,
} = mapOfWeatherSlice.actions

// reducer
export default mapOfWeatherSlice.reducer

// Asynchronous thunk action
export function fetchWeather() {
    return async (dispatch) => {
        dispatch(getWeather())

        try {
            // get all stations with own weather data
            const response = await fetch(
                'https://danepubliczne.imgw.pl/api/data/synop/'
            )
            const allStationWithWeather = await response.json()

            // dispatch(getWeatherSuccess(allStationWithWeather))

            console.log(
                'allStationWithWeather',
                allStationWithWeather[0].stacja
            )

            let promisesOfForwardGeo = []

            for (let i = 0; i < 20; i++) {
                promisesOfForwardGeo.push(
                    fetch(
                        `http://api.positionstack.com/v1/forward?access_key=358c451c8bc4c40048fd777aa721ad30&query=1600%${allStationWithWeather[i].stacja}`
                    )
                )
            }

            promisesOfForwardGeo = promisesOfForwardGeo.map((promise, key) =>
                promise.then((resolve) => resolve.json()).then((geoData) => {
                    console.log('key', key)
                    return geoData.data[0]
                })
            )

            Promise.all(promisesOfForwardGeo)
                .then((response) => {
                    console.log(response)

                    dispatch(getWeatherSuccess(response))
                })
                .catch((error) => alert(error))

            /* 
            promisesOfForwardGeo = promisesOfForwardGeo.map((e) =>
                e
                    .then((resolve) => resolve.json())
                    .then((data) => data.results[0].name)
            )

            Promise.all(promisesOfForwardGeo)
                .then((resolve) => {
                    console.log(resolve)
                    resolve.map((e) => document.write(e.last, ', '))
                })
                .catch((e) => alert('reloadddd!')) */

            /* 
            const randomStacja =
                allStationWithWeather[
                    Math.floor(Math.random() * allStationWithWeather.length)
                ].stacja

            console.log(randomStacja, 'adfsasdfasdf') */

            // forward geocoding
            /* 
            const getForwardGeocoding = await fetch(
                `http://api.positionstack.com/v1/forward?access_key=358c451c8bc4c40048fd777aa721ad30&query=1600%${randomStacja}`
            )
            const getForwardGeocodJSON = await getForwardGeocoding.json()
            const resultForwardGeocodForMap = getForwardGeocodJSON.data[0].name
            console.log('resultForwardGeocodForMap', resultForwardGeocodForMap)
 */
            /* 
            let promisesOfForwardGeo = []
            for (let i = 0; i < 0; i++) {
                const randomStacja =
                    allStationWithWeather[
                        Math.floor(Math.random() * allStationWithWeather.length)
                    ].stacja

                promisesOfForwardGeo.push(
                    fetch(
                        `http://api.positionstack.com/v1/forward?access_key=358c451c8bc4c40048fd777aa721ad30&query=1600%${randomStacja}`
                    )
                )
            }

              */

            /* todo */
            /* 
            const responseSome = await fetch('https://randomuser.me/api/')
            const someData = await responseSome.json()

            const someResult = someData.results[0].name.first

            console.log(someResult)
            dispatch(
                someReducer(
                    resultForwardGeocodForMap +
                        '___' +
                        someResult +
                        ' : ' +
                        allStationWithWeather[
                            Math.floor(
                                Math.random() * allStationWithWeather.length
                            )
                        ].temperatura
                )
            ) */
        } catch (error) {
            dispatch(getWeatherFailure())
            alert('Some problem, please reload page!')
        }
    }
}
