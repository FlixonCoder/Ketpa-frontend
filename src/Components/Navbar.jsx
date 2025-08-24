import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext';

const Navbar = () => {

  const navigate = useNavigate();

  const { token, setToken, userData } = useContext(AppContext)

  const [showMenu, setShowMenu] = useState(false)

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 
                    sticky top-0 bg-white z-50 px-4 md:px-8'>
      
      {/* Logo */}
      <img onClick={() => navigate('/')} className='w-36 md:w-44 cursor-pointer' src={assets.logo} alt="logo" />

      {/* Desktop Nav */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/find-vets'>
          <li className='py-1'>FIND VETS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      {/* Right Side */}
      <div className='flex items-center gap-4'>
        {
          token && userData ? (
            <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-12 rounded-full' src={userData.image} alt="User img" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                  <p className='hover:text-black cursor-pointer' onClick={() => navigate('/my-profile')}>My Profile</p>
                  <p className='hover:text-black cursor-pointer' onClick={() => navigate('/my-appointments')}>My Appointments</p>
                  <p className='hover:text-black cursor-pointer' onClick={logout}>Log Out</p>
                </div>
              </div>
            </div>
          ) : (
            <button 
                onClick={() => navigate('/login')} 
                className="hidden md:block bg-primary text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-light"
                >
                Create Account
            </button>
          )
        }

        {/* Hamburger Icon */}
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden cursor-pointer' src={assets.menu_icon} alt="menu" />

        {/* Mobile Menu */}
        <div className={`${showMenu ? 'fixed w-full h-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-30 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="logo-img" />
            <img className='w-10 cursor-pointer' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="cross-img" />
          </div>
          <ul className='flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/find-vets'><p className='px-4 py-2 rounded inline-block'>FIND VETS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>

            {/* Create Account in Mobile */}
            {!token && (
              <button 
                onClick={() => { setShowMenu(false); navigate('/login'); }} 
                className="bg-primary text-white px-6 py-3 rounded-full font-light mt-4"
              >
                Create Account
              </button>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
