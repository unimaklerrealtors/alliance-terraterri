import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Header = () => {
  const [show, setShow] = useState(false);


  return (
    <>




      <header className="section page-header">
        <nav className="navbar navbar-expand-lg navbar-light ps-3 pe-3 d-flex">
          <Link className="navbar-brand p-0" to={"https://terraterri.com/"}>NexAirpropx</Link>
          <button className="navbar-toggler" onClick={() => setShow(true)} type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" ></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav align-items-center">

              <li className="nav-item active">
                <Link className="nav-link" to={"/"}>Home <span className="sr-only">(current)</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/airPropxSub"}>AirPropX</Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to={"/whyexhibit"}>Why Exhibit</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/whyVisit"}>Why Visit</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`https://builder.admin.terraterri.com/`} target="_blank">Book Your Stall</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/registration?expoCode=INHYD14JUL26-R"}>Expo Registration</Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to={""}>Blogs</Link>
              </li> */}

              {/* <li className="nav-item">
                <Link className="nav-link" to={"https://terraterri.com/contact"}>Contact Us</Link>
              </li> */}
              {/* <li className="nav-item">
                <Link to={"https://terraterri.com/MainLogin"}> <button className='kave-btn f-11px' href="#">SignIn</button></Link>

              </li> */}
            </ul>
          </div>

          <Link className="navbar-brand p-0 text-right" to={"https://terraterri.com/"}><img src="../../assets/images/airpropx-logo.png" alt="logo" /></Link>
        </nav>


      </header>
      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>  <Link className="navbar-brand p-0" to={"https://terraterri.com/"}><img src="../../assets/images/TT_200x50.webp" alt="logo" /></Link></Offcanvas.Title>
          {/* <a href="/MainLogin">
            <button className="sig-in">Sign in</button>
          </a> */}
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="navbar-nav ">

            <li className="nav-item active">
              <Link className="nav-link" to={"/"} onClick={() => setShow(false)}>Home <span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/airPropxSub"} onClick={() => setShow(false)}>AirPropX</Link>
            </li>
            <li className="nav-item">

              <NavDropdown title="Solutions" id="basic-nav-dropdown">
                {/* <NavDropdown.Item href="/solutions">Realestate Webinars</NavDropdown.Item> */}
                <NavDropdown.Item href="/costomisedExpo" onClick={() => setShow(false)}>Exclusive Builder Expos</NavDropdown.Item>
                <NavDropdown.Item href="/phygiverse" onClick={() => setShow(false)}>Phygiverse Expos</NavDropdown.Item>
                {/* <NavDropdown.Item href="#action/3.3">Meta Brand Promotions</NavDropdown.Item> */}
                {/* <NavDropdown.Item href="#action/3.3">Metavarse Project Lanch</NavDropdown.Item> */}
                <NavDropdown.Item href="/hostbrandexpo" onClick={() => setShow(false)}>Host Your Branded Expo</NavDropdown.Item>
                {/* <NavDropdown.Item href="#action/3.4">International Realestate Expos</NavDropdown.Item> */}
                {/* <NavDropdown.Item href="#action/3.4">Expo Registration</NavDropdown.Item> */}
              </NavDropdown>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/whyexhibit"} onClick={() => setShow(false)}>Why Exhibit</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/whyVisit"} onClick={() => setShow(false)}>Why Visit</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`https://builder.admin.terraterri.com`} onClick={() => setShow(false)}>Book Your Stall</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={"/registration?expoCode=INHYD14JUL26-R"} onClick={() => setShow(false)}>Expo Registration</Link>
            </li>
            {/* <li className="nav-item">
  <Link className="nav-link" to={""}>Blogs</Link>
</li> */}

            {/* <li className="nav-item">
  <Link className="nav-link" to={"https://terraterri.com/contact"}>Contact Us</Link>
</li> */}
            <li className="nav-item">
              <Link to={"https://terraterri.com/MainLogin"}> <button className='kave-btn f-11px' href="#">Sign In</button></Link>

            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
export default Header