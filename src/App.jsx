
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Doctors from './Pages/FindVets'
import Login from './Pages/Login'
import About from './Pages/About'
import MyProfile from './Pages/MyProfile'
import MyAppointements from './Pages/MyAppointements'
import Appointments from './Pages/Appointments'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import Contact from './Pages/Contact'
import Footer from './Components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import EmergencyFab from './Components/Emergency'
import EmergencyVetsPage from './Pages/EmergencyVets'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <EmergencyFab />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/find-vets' element={<Doctors />} />
        <Route path='/find-vets/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/emergency' element={<EmergencyVetsPage />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointements />} />
        <Route path='/appointment/:docId' element={<Appointments />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
