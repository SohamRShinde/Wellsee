import { useLocation,  Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../AuthContext" 

export default function Sidebar({ isOpen, onToggle }) { 
    const location = useLocation()
    const { user } = useContext(AuthContext)

    const isCLubAdmin = user?.role === "club_admin"

    const committees = [
        { id: 1, name: "Student Council" },
        { id: 2, name: "CSI" },
        { id: 3, name: "IEEE" },
        { id: 4, name: "Cultural Club" },
        { id: 5, name: "Sports Cell" }
    ]
    // const isEventsChildActive =  location.pathname === "/create-event" || location.pathname === "/past-events"
    return (
        <div
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 border-r border-blue-800 p-4 shadow-xl z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
            <ul className="menu w-full p-0 text-blue-200">
                
                {/* --- OPTION A: COMMITTEE VIEW --- */}
                {isCLubAdmin ? (
                    <>
                        <li className="menu-title text-blue-500 uppercase text-xs font-bold tracking-wider mb-2">Management</li>
                        <li>
                            <Link
                                to="/dashboard"
                                onClick={onToggle}
                                className={`hover:bg-blue-900 hover:text-white mb-1 ${location.pathname === "/dashboard" ? "bg-blue-800 text-white active" : ""}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-10v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                Dashboard
                            </Link>
                        </li>
                        
                        {/* Events Submenu */}
                        <li>
                            <details open>
                                <summary className="hover:bg-blue-900 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Events
                                </summary>
                                <ul>
                                    <li>
                                        <Link
                                            to="/create-event"
                                            onClick={onToggle}
                                            className={`hover:bg-blue-900 hover:text-white ${location.pathname === "/create-event" ? "bg-blue-800 text-white" : ""}`}
                                        >
                                            Create Event
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/past-events"
                                            onClick={onToggle}
                                            className={`hover:bg-blue-900 hover:text-white ${location.pathname === "/past-events" ? "bg-blue-800 text-white" : ""}`}
                                        >
                                            Past Events
                                        </Link>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </>
                ) : (
                    /* --- OPTION B: STUDENT / GUEST VIEW --- */
                    <>
                        <li className="menu-title text-blue-500 uppercase text-xs font-bold tracking-wider mb-2">Explore</li>
                        
                        <li>
                            <Link to="/all-events" onClick={onToggle} className="hover:bg-blue-900 hover:text-white mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                All Events
                            </Link>
                        </li>

                        <div className="divider my-2 border-blue-900/50"></div>

                        <li className="menu-title text-blue-500 uppercase text-xs font-bold tracking-wider mb-2">Filter By Committee</li>
                        
                        {committees.map((committee) => (
                            <li key={committee.id}>
                                <label className="label cursor-pointer justify-start hover:bg-blue-900 hover:text-white py-2">
                                    <input 
                                        type="checkbox" 
                                        className="checkbox checkbox-xs checkbox-info border-blue-500 rounded-sm mr-3" 
                                        // You can add an onChange handler here to update a filter state
                                    />
                                    <span className="text-sm">{committee.name}</span>
                                </label>
                            </li>
                        ))}
                    </>
                )}
            </ul>
        </div>
    )
}