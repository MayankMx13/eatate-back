import { useContext, useState } from "react";
import "./Navbar.scss"
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
    const [open, setOpen] = useState(false);
    const { currentUser } = useContext(AuthContext)
    const fetch = useNotificationStore(state => state.fetch)
    const number = useNotificationStore(state => state.number)
    if (currentUser) fetch();
    return (
        <nav>
            <div className="left">
                <a href="/" className="logo">
                    <img src="/logo.png" alt="" />
                </a>
                <a href="">Home</a>
                <a href="">About</a>
                <a href="">Contact us</a>
                <a href="">Agents</a>
            </div>
            <div className="right">
                {currentUser ? (<div className="user">

                    <Link to="/profile" className="profile">
                        <div className="ll ">
                            <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
                            {number > 0 && <div className="notification">{number}</div>}
                            <span>{currentUser.username}</span>
                        </div>
                    </Link>
                </div>) : (
                    <>
                        <a href=""><Link to={"/login"}>Sign in</Link></a>
                        <a href="" className="register"><Link to={"/register"}>Sign up</Link></a>
                    </>
                )}
                <div className="menuIcon">
                    <img src="/menu.png" alt="" onClick={() => setOpen(!open)} />
                </div>
                <div className={open ? "menu active" : "menu"}>
                    <a href="">Home</a>
                    <a href="">About</a>
                    <a href="">Contact us</a>
                    <a href="">Agents</a>
                    <a href="">Sign in</a>
                    <a href="">Sign up</a>
                </div>

            </div>
        </nav>

    )
}

export default Navbar;