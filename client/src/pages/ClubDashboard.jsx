import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { AuthContext } from "../AuthContext"
import { Link } from "react-router-dom"

export default function ClubDashboard() {
    const { user } = useContext(AuthContext)
    const [club, setClub] = useState(null)
    const [loading, setLoading] = useState(true)

    // Mock data for UI demonstration (Replace with real API calls later)
    const [events, setEvents] = useState({
        upcoming: [
            { _id: "1", title: "Intro to React Workshop", date: "2025-11-10", registrants: 45 },
            { _id: "2", title: "Hackathon Prep Session", date: "2025-11-15", registrants: 12 },
        ],
        past: [
            { _id: "3", title: "AI Seminar 2024", date: "2025-10-01", mediaCount: 0 },
            { _id: "4", title: "Freshers Coding Contest", date: "2025-09-15", mediaCount: 5 },
        ]
    })

    useEffect(() => {
        const fetchClubData = async () => {
            try {
                // Fetch all clubs and find the one this user manages
                const res = await axios.get("/api/clubs")
                const myClub = res.data.find(c => c.admin === user?._id)
                
                if (myClub) {
                    setClub(myClub)
                }
            } catch (error) {
                console.error("Failed to load club data", error)
            } finally {
                setLoading(false)
            }
        }

        if (user) fetchClubData()
    }, [user])

    if (loading) return <div className="text-center text-blue-300 mt-20">Loading Dashboard...</div>
    
    if (!club) return (
        <div className="text-center mt-20">
            <h2 className="text-2xl text-blue-200">No Club Found</h2>
            <p className="text-gray-400">You are not assigned as an admin for any club.</p>
        </div>
    )

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 text-blue-100">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-blue-800 pb-6">
                <div className="flex items-center gap-5">
                    <img 
                        src={club.logo || "https://via.placeholder.com/100"} 
                        alt={club.name} 
                        className="w-24 h-24 rounded-xl object-cover border-2 border-blue-500 shadow-lg bg-gray-800"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{club.name}</h1>
                        <p className="text-blue-400 text-sm mt-1 max-w-xl">{club.description}</p>
                    </div>
                </div>
                <div className="flex gap-3 shrink-0">
                    <Link to={`/edit-club/${club._id}`} className="px-5 py-2.5 bg-gray-900 border border-blue-700 text-blue-300 rounded-lg hover:bg-blue-900/50 transition font-medium">
                        Edit Profile
                    </Link>
                    <Link to="/create-event" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        New Event
                    </Link>
                </div>
            </div>

            {/* --- MAIN GRID --- */}
            <div className="grid grid-cols-1  gap-8">
                
                {/* LEFT COL: UPCOMING MANAGEMENT */}
                <div className="space-y-6">
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                            Upcoming Events
                        </h2>  
                    </div>

                    <div className="grid gap-4">
                        {events.upcoming.map(event => (
                            <div key={event._id} className="bg-gray-900 border border-blue-800 rounded-xl p-5 hover:border-blue-600 transition group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg text-blue-100 group-hover:text-white transition">{event.title}</h3>
                                        <p className="text-blue-400 text-sm mt-1">{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-blue-950 px-3 py-1 rounded border border-blue-900">
                                        <span className="text-xl font-bold text-blue-200">{event.registrants}</span>
                                        <span className="text-xs text-blue-500 ml-1">Regs</span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 border-t border-blue-900/50 pt-4">
                                    <Link 
                                        to={`/events/${event._id}/participants`}
                                        className="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-medium transition"
                                    >
                                        View Registrants
                                    </Link>
                                    <button className="px-3 py-2 text-blue-400 hover:text-white hover:bg-blue-900 rounded-lg transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {events.upcoming.length === 0 && (
                            <div className="text-center py-8 text-gray-500 bg-gray-900/50 rounded-xl border border-dashed border-gray-800">
                                No upcoming events scheduled.
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COL: PAST EVENTS & MEDIA */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                            Past Events & Highlights
                        </h2>
                    </div>

                    <div className="grid gap-4">
                        {events.past.map(event => (
                            <div key={event._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="font-medium text-gray-300">{event.title}</h3>
                                        <p className="text-gray-500 text-sm">{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                    {event.mediaCount > 0 ? (
                                        <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-900">
                                            {event.mediaCount} Photos Live
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                                            No Media
                                        </span>
                                    )}
                                </div>

                                <button className="w-full border border-dashed border-gray-600 hover:border-blue-500 hover:bg-blue-900/10 text-gray-400 hover:text-blue-300 py-3 rounded-lg transition flex items-center justify-center gap-2 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Upload Photos / Videos
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}