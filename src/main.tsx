import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./routes/root"
import Signup from "./routes/signup"
import Login from "./routes/login"
import Dashboard from "./routes/dashboard"
import ErrorPage from "./error-page"
import "./globals.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { FirebaseProvider } from "./contexts/firebaseContext";
import { UserProvider } from "./contexts/userContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </FirebaseProvider>
  </React.StrictMode>,
)
