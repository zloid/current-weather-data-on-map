import { combineReducers } from '@reduxjs/toolkit'
import mapOfWeatherReducer from '../features/mapOfWeather/mapOfWeatherSlice';

const rootReducer = combineReducers({
    mapOfWeatherReducer
})

export default rootReducer