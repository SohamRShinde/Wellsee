import { useLocation, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../AuthContext"
import api from "../api.js"

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
        api.post("/api/auth/logout")
            .then(res => console.log(res))
    }

    return (
        // Changed bg-base-100 to bg-gray-900 and added border-blue-800
        <div className="navbar bg-gray-900 border-b border-blue-800 text-blue-100 shadow-lg px-4 z-50 fixed top-0 w-full">
            <div className="navbar-start flex items-center gap-2">
                <button
                    onClick={onToggleSidebar}
                    className="btn btn-ghost btn-circle text-blue-300 hover:bg-blue-900 hover:text-white"
                    aria-label="Toggle sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <button
                    onClick={() => navigate("/")}
                    className="btn btn-ghost text-xl font-bold normal-case text-blue-100 hover:bg-blue-900"
                >
                    wellsee
                </button>
            </div>

            <div className="navbar-center hidden sm:flex w-1/3">
                <form onSubmit={handleSearch} className="w-full">
                    <div className="join w-full">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search events..."
                            // Customized input colors
                            className="input input-bordered join-item w-full bg-gray-800 border-blue-700 text-blue-100 placeholder-blue-400 focus:outline-none focus:border-blue-500 h-10 min-h-0"
                        />
                        <button
                            type="submit"
                            className="btn join-item bg-blue-700 border-blue-700 text-white hover:bg-blue-600 h-10 min-h-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <div className="navbar-end">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-blue-600 hover:border-blue-400">
                            <div className="w-10 rounded-full bg-blue-900 text-blue-100 flex items-center justify-center">
                                <span className="text-lg font-semibold">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </span>
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            // Customized dropdown colors
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-gray-900 border border-blue-800 rounded-box w-52 text-blue-200"
                        >
                            <li className="menu-title text-blue-500">
                                <span>{user.name}</span>
                            </li>
                            <li>
                                <a onClick={() => navigate("/profile")} className="hover:bg-blue-900 hover:text-white">
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a onClick={() => navigate("/settings")} className="hover:bg-blue-900 hover:text-white">
                                    Settings
                                </a>
                            </li>
                            <div className="divider my-0 border-blue-800"></div>
                            <li>
                                <a onClick={handleLogout} className="text-red-400 hover:bg-red-900/30 hover:text-red-300">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/register")}
                            className="btn btn-ghost text-blue-300 hover:bg-blue-900 hover:text-white"
                        >
                            Register
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="btn bg-blue-700 text-white border-none hover:bg-blue-600 rounded-full px-6"
                        >
                            Log in
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}