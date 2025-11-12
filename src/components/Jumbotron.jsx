import React from 'react';
import Iphone from '../assets/images/iphone-14.jpg';
import HoldingIphone from '../assets/images/iphone-hand.png';

const Jumbotron = () => {

  const handleLearnMore = (e) => {
    console.log('clicked lear more');
   e.preventDefault();
   const element = document.querySelector('.sound-section');
   window.scrollTo({
    top: element.offsetTop,
    left: 0,
    behavior: 'smooth'
   });
  }


  return (
    <div className="jumbotron-section wrapper">
      <h2 className='title'>New</h2>
      <img className='logo' src={Iphone} alt="iPhone 14 Pro" />
      <p className='text'>Big and Bigger.</p>
      <span className='description'>
        From $41.62/mo. for 24mo. or $999 before trade-in
      </span>
      <ul className='links'>
        <li><button className='button' >Buy</button></li>
        <li><a href="#" className='link' onClick={handleLearnMore}>Learn More</a></li>
      </ul>

      <img className='iphone-img' src={HoldingIphone} alt="iPhone 14 Pro" />
    </div>
  );
};

export default Jumbotron;