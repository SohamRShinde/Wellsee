import { useLocation, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../AuthContext"
import axios from "axios"

export default function Navbar({ onToggleSidebar }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext)
    const [search, setSearch] = useState("")
    const hiddenPaths = ["/form"]

    if (hiddenPaths.includes(location.pathname)) return null

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) {
            console.log("Searching for:", search)
        }
    }

    const handleLogout = () => {
        setUser(null)
        navigate("/")
        axios.post("/api/auth/logout")
        .then(res => alert(res))
    }

    return (
        <div className="navbar bg-base-100 shadow-lg px-4 z-50">
            <div className="navbar-start flex items-center gap-2">
                <button 
                    onClick={onToggleSidebar}
                    className="btn btn-ghost btn-circle"
                    aria-label="Toggle sidebar"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        className="inline-block w-5 h-5 stroke-current"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => navigate("/")}
                    className="btn btn-ghost text-xl font-bold normal-case"
                >
                    wellsee
                </button>
            </div>

            <div className="navbar-center">
                <form onSubmit={handleSearch} className="w-full">
                    <div className="join w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search for events or clubs..."
                            className="input input-bordered join-item w-full"
                        />
                        <button
                            type="submit"
                            className="btn btn-primary join-item "
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <div className="navbar-end">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                                <span className="text-lg font-semibold">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </span>
                            </div>
                        </label>
                        <ul 
                            tabIndex={0} 
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            <li className="menu-title">
                                <span>{user.name}</span>
                            </li>
                            <li>
                                <a onClick={() => navigate("/profile")}>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                        />
                                    </svg>
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a onClick={() => navigate("/settings")}>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                                        />
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                        />
                                    </svg>
                                    Settings
                                </a>
                            </li>
                            <div className="divider my-0"></div>
                            <li>
                                <a onClick={handleLogout} className="text-error">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                                        />
                                    </svg>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/register")}
                            className="btn btn-ghost"
                        >
                            Register
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="btn btn-primary rounded-full"
                        >
                            Log in
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}