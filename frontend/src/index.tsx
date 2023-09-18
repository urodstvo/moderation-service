import '@/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from '@/components/Navbar.tsx'
import { routes } from '@/pages/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
      <Navbar />
      <main className="main-container">
        <div className="main-content">
            <Routes>
                {routes.map((route, ind) => <Route key={ind} path={route.path} element={route.element}/>)}
            </Routes>
        </div>
      </main>
      </BrowserRouter>
  </React.StrictMode>,
)
