import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./routes/root"
import Signup from "./routes/signup"
import Login from "./routes/login"
import Dashboard from "./routes/dashboard"
import Devices, { loader as devicesLoader } from "./routes/devices"
import Device, { loader as deviceLoader } from "./routes/device"
import Items, { loader as itemLoader } from "./routes/items"
import CreateItem from "./routes/createItem"
import Profile from "./routes/profile"
import CreateDevice from "./routes/createDevice"
import Events, { loader as eventsLoader } from "./routes/events"
import CreateEvent from "./routes/createEvent"
import AuthenticatedLayout from './routes/authenticatedLayout'
import ErrorPage from "./error-page"
import "./globals.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from "./contexts/userContext";
import AuthWrapper from "@/components/authWrapper"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: 
    <AuthWrapper>
      <AuthenticatedLayout />
    </AuthWrapper>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "devices",
        element: <Devices />,
        loader: devicesLoader
      },
      {
        path: "devices/create",
        element: <CreateDevice />,
      },
      {
        path: "devices/:id",
        element: <Device />,
        loader: deviceLoader
      },
      {
        path: "items",
        element: <Items />,
        loader: itemLoader
      },
      {
        path: "items/create",
        element: <CreateItem />,
      },
      {
        path: "events",
        element: <Events />,
        loader: eventsLoader
      },
      {
        path: "events/create",
        element: <CreateEvent />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ]
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
)
