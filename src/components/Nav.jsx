import React from 'react';
import Logo from '../assets/images/logo.svg';
import Search from '../assets/images/search.svg';
import Store from '../assets/images/store.svg';     
import { Link } from 'react-router';

function Nav() {
  return (
    <nav className="nav-wrapper">
      <div className='nav-content'>
        <ul className='list-styled'>
            <li><img src={Logo} alt="Logo" /></li>
            <li><Link className="link-styled" to="/">Store</Link></li>
            <li><Link className="link-styled"to="/about">Mac</Link></li>
            <li><Link className="link-styled"to="/about">iPad</Link></li>
            <li><Link className="link-styled"to="/about">iPhone</Link></li>
            <li><Link className="link-styled"to="/about">Watch</Link></li>
            <li><Link className="link-styled"to="/about">Airpods</Link></li> 
            <li><Link className="link-styled"to="/about">Tv &amp; Home</Link></li> 
            <li><Link className="link-styled"to="/about">Entertainment</Link></li> 
            <li><Link className="link-styled"to="/about">Accessories</Link></li>  
            <li><Link className="link-styled"to="/about">Support</Link></li>       

            <li><img src={Search} alt="search" /></li> 
            <li><img src={Store} alt="store" /></li> 

        </ul>
      </div>
    </nav>
  );
}

export default Nav;