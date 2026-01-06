import {Routes, Route} from 'react-router-dom'

import AppLayout from "./components/AppLayout"
import FormBuilder from "./pages/FormBuilder"
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import ClubDashboard from './pages/ClubDashboard';
import CreateEvent from './pages/CreateEventForm';


function App() {

  return (
    <>
      <Routes>
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route element={<AppLayout/>}>
          <Route path='/' element={<LandingPage/>} />
          
          <Route path='/dashboard' element={<ClubDashboard/>} />
          <Route path='/create-event' element={<CreateEvent/>} />
          <Route path='/create-event/form' element={<FormBuilder/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
