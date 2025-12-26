import { useLocation,  Link } from "react-router-dom"
import { AuthContext } from "../AuthContext" 

export default function Sidebar({ isOpen, onToggle }) { 
    const location = useLocation()

    const isEventsChildActive =  location.pathname === "/create-event" || location.pathname === "/past-events"
    console.log(isEventsChildActive)
    return (
        <>
            <div 
                className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-base-200 p-4 shadow-xl z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                
                <ul className="menu bg-base-200 w-full rounded-box">
                    <li>
                        <Link 
                            to="/dashboard" 
                            onClick={onToggle} 
                            className={location.pathname === "/dashboard" ? "menu-active" : ""}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-10v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Dashboard
                        </Link>
                    </li>
                    <li className={isEventsChildActive ? "menu-open" : ""}>
                        <a>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Events
                        </a>
                        <ul>
                            <li>
                                <Link 
                                    to="/create-event"
                                    onClick={onToggle} 
                                    className={location.pathname === "/create-event" ? "menu-active" : ""}
                                >
                                    Create Event
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/past-events"
                                    onClick={onToggle} 
                                    className={location.pathname === "/past-events" ? "active" : ""}
                                >
                                    Past Events
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    )
}