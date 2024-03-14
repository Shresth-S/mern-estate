import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';

export const store = configureStore({
    reducer: {user:userReducer},
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ // by adding this statement we will not get an error for not serializing our variables
        serializableCheck: false
    })
})