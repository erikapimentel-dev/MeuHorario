import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './components/teste.jsx'
import Sidebar from './components/navbar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Home />
    <Sidebar items={['Home', 'About', 'Contact']} onItemClick={(item) => console.log(item)}/>
  </StrictMode>,
)
