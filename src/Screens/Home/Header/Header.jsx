import React from 'react'
import { useTranslation } from 'react-i18next'
import './Header.css'
import logo from '../../../assets/india.png'


//Header component is the top of the home screen which contains the logo and language changing dropdown.
// t and useTranslation function is used to translate the content of the page 
// references for translation is https://app.i18nexus.com/


const Header = () => {
    // It is a hook imported from 'react-i18next'
    const { t,i18n } = useTranslation();

    const currentLanguage = i18n.language;

    const languages = [
       { value: 'en', text: "English" },
       { value: 'hi', text: "Hindi" },
       { value: 'ta', text: "Tamil" },
       { value: 'bn', text: "Bengali" },
       { value: 'kn', text: "Kannadam" },
       { value: 'gu', text: "gujarathi" },
       { value: 'mr', text: "marathi" },
       { value: 'ml', text: "Malayalam" },
       { value: 'pa', text: "Punjabi" },
       { value: 'te', text: "Telugu" },
   ]
 
    // This function put query that helps to
    // change the language of the web which is mentioned in loc.
    const handleChange = e => {
        let loc = "http://192.168.1.21:3000/";
        window.location.replace(loc + "?lng=" + e.target.value);

    }
  return (
    <div className='header'>
      <div className='header-main'>
      <img src={logo} className='header-logo' alt='logo'/>
      <h3>{t('header')}</h3>
      </div>
      <div className='header-end'>
        <select className='header-select' value={currentLanguage} onChange={handleChange}>
                {languages.map(item => {
                    return (<option key={item.value}
                        value={item.value}>{item.value}</option>);
                })}
            </select>
      </div>
    </div>
  )
}

export default Header
