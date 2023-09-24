import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Navbar.css'
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import CandidateSearch from '../Dashboard/Candidate/CandidateSearch';
import Party from '../Dashboard/Party/Party';

// This page contains about the navigation bar on top of the home page
// t and useTranslation function is used to translate the content of the page 
// references for translation is https://app.i18nexus.com/

const Navbar = () => {
  // const [currentUrl, setCurrentUrl] = useState(window.location.pathname)
  const [selectedItem, setSelectedItem] = useState(0);
  const { t } = useTranslation();

  return (
    <>
      <Router>
        <nav className='navigation'>
          <div className='nav-content'>
            <ul>
              <li
                onClick={() => setSelectedItem(0)}
              >
                <Link to="/" className={`${selectedItem === 0 ? 'activeLink' : 'deactiveLink'}`}>
                  {t('HOME')}
                </Link>
              </li>
              <li
                onClick={() => setSelectedItem(1)}
              >
                <Link to="/candidate" className={`${selectedItem === 1 ? 'activeLink' : 'deactiveLink'}`}>
                  {t('CANDIDATE SEARCH')}
                </Link>
              </li>
              <li
                onClick={() => setSelectedItem(2)}
              >
                <Link to="/party" className={`${selectedItem === 2 ? 'activeLink' : 'deactiveLink'}`}>
                  {t('PARTY SEARCH')}
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route exact path='/' element={< Dashboard />}></Route>
          <Route exact path='/candidate' element={< CandidateSearch />}></Route>
          <Route exact path='/party' element={< Party />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default Navbar
