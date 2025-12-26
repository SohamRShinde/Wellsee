import {Routes, Route} from 'react-router-dom'
import axios from 'axios';

import AppLayout from "./components/AppLayout"
import Navbar from "./components/Navbar";
import FormBuilder from "./pages/FormBuilder"
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEventForm';

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true

function App() {

  return (
    <>
      <Routes>
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route element={<AppLayout/>}>
          <Route path='/' element={<LandingPage/>} />
          
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/create-event' element={<CreateEvent/>} />
          <Route path='/events/:eventId/form' element={<FormBuilder/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
