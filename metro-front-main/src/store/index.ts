import { setupListeners } from '@reduxjs/toolkit/query'
import rootReducer from "../store/reducer";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage: storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
})

setupListeners(store.dispatch)

const persistedStore = persistStore(store);

export { store, persistedStore };