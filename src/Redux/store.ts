import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { appSlice } from './app/appSlice';

const appPesistConfig = {
    key: 'app',
    storage,
    whitelist: [
        'position'
    ],
};
const persistedAppReducer = persistReducer(appPesistConfig, appSlice.reducer);
export const store = configureStore({
    reducer: {
        app: persistedAppReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);