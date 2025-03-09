import React from 'react'
import { Link } from 'react-router-dom';


const Navbar = () => {
    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };
  return (
    <div>
        <header className="navbar">
          <div className="logo">Veda Bot</div>
          <nav>
            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/#about">About</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </nav>
        </header>
    </div>
  )
}

export default Navbar
