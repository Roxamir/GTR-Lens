import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

// Components 
import Root from './routes/Root'
import EquipmentList from './pages/EquimpentList'
import Error from './pages/Error'
import Home from './pages/Home'
import Login from './pages/Login'
import PhotoList from './pages/PhotoList'
import Upload from './pages/Upload'



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "equipment",
        element: <EquipmentList />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "photos",
        element: <PhotoList />
      },
      {
        path: "upload",
        element: <Upload />
      },
    ]

  },
  
]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;