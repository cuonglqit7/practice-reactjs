import { get } from "lodash";
import { useContext, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import logoApp from "../assets/images/logo192.png";
import { toast } from "react-toastify";
import { UserContext } from "./context/UserContent";

const Header = (props) => {
    const location = useLocation();
    const { user, logout } = useContext(UserContext);

    // const [hideHeader, setHideHeader] = useState(false);

    // useEffect(() => {
    //     if (window.location.pathname === "/login") {
    //         setHideHeader(true);
    //     }else setHideHeader(false);
    // }, []);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
        toast.success("Log out successfully");
    };
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <NavLink to="/" className="navbar-brand nav-link">
                    <img src={logoApp} width={30} />
                    <span>React pratice</span>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {(user && user.auth) || window.location.pathname === "/" ? (
                        <>
                            <Nav
                                className="me-auto"
                                activeKey={location.pathname}
                            >
                                <NavLink to="/" className="nav-link">
                                    Home
                                </NavLink>

                                <NavLink to="/users" className="nav-link">
                                    Manager Users
                                </NavLink>
                            </Nav>
                            <Nav className="d-flex align-items-center">
                                {user && user.auth === true ? (
                                    <div>Welcom {localStorage.getItem("email")}</div>
                                ) : (
                                    ""
                                )}
                                <NavDropdown
                                    title="User"
                                    id="basic-nav-dropdown"
                                >
                                    {user && user.auth === true ? (
                                        <NavDropdown.Item
                                            onClick={() => handleLogout()}
                                            className="dropdown-item"
                                        >
                                            Logout
                                        </NavDropdown.Item>
                                    ) : (
                                        <NavLink
                                            to="/login"
                                            className="nav-link dropdown-item"
                                        >
                                            Login
                                        </NavLink>
                                    )}
                                </NavDropdown>
                            </Nav>
                        </>
                    ) : (
                        ""
                    )}
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};

export default Header;
