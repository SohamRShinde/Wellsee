import { useState, useEffect } from "react"
import axios from "axios"

export default function LandingPage() {
    const [expanded, setExpanded] = useState(null)

    const [upcomingEvents, setUpcomingEvents] = useState([])
    const [pastEvents, setPastEvents] = useState([])

    const[page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [loadingPast, setLoadingPast] = useState(false)

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const res = await axios.get('/api/events/upcoming')
                setUpcomingEvents(res.data)
            } catch (error) {
                console.error("Failed to load upcoming events", error)
            }
        }
        fetchUpcoming()
    }, [])

    useEffect(() => {
        loadingPastEvents(1, true)
    }, [])

    const loadingPastEvents = async (pageNum, reset = false) => {
        setLoadingPast(true)
        try {
            const res = await axios.get(`/api/events/past?page=${pageNum}`)
            console.log(res)
            if (reset) {
                setPastEvents(res.data.events)
            } else {
                setPastEvents(prev => [...prev, ...res.data.events])
            }

            setHasMore(res.data.hasMore)
            setPage(pageNum)
        } catch (error) {
            console.error("Failed to load past events", error)
        } finally {
            setLoadingPast(false)
        }
    }
  
    return (
        <div className="min-h-screen bg-gray-950 text-blue-100">
            {/* HERO */}
            <section className="text-center py-8 bg-gradient-to-r from-blue-900 to-blue-700">
                <h1 className="text-4xl font-bold mb-3 text-blue-100">Discover Campus Events</h1>
                <p className="text-blue-300 text-lg">Join, participate, and connect with your community</p>
            </section>

            {/* UPCOMING EVENTS */}
            <EventSection
                title="Upcoming Events"
                events={upcomingEvents}
                expanded={expanded}
                setExpanded={setExpanded}
            />

            {/* PAST EVENTS */}
            <EventSection
                title="Past Events"
                events={pastEvents}
                expanded={expanded}
                setExpanded={setExpanded}
                isPast
            />

            {hasMore && (
                <div className="flex justaify-center pb-12">
                    <button
                        onClick={() => loadingPastEvents(page + 1)}
                        disabled={loadingPast}
                        className="px-6 py-2 bg-transparent border border-blue-500 text-blue-300 rounded hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                        {loadingPast ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

            {/* FOOTER */}
            <footer className="bg-blue-900 text-center py-4 border-t border-blue-800 text-blue-300">
                © 2025 Wellsee — All rights reserved.
            </footer>
        </div>
    )
}

function EventSection({ title, events, expanded, setExpanded, isPast }) {
    
    // Helper to format dates
    const formatDate = (isoDate) => {
        if (!isoDate) return "Date TBD";
        return new Date(isoDate).toLocaleDateString("en-US", {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    if (!events || events.length === 0) return null;

    return (
        <section className="py-12 px-6">
            <h2 className="text-2xl font-bold text-blue-300 mb-8 text-center">{title}</h2>

            <div className="flex flex-col gap-3 justify-center items-center"> 
                {events.map((event) => {
                    // 1. Force both IDs to be Strings for safe comparison
                    const isExpanded = String(expanded) === String(event._id);

                    return (
                        <div
                            key={event._id} 
                            // 2. Remove 'overflow-hidden' temporarily to see if CSS is hiding it
                            // Added 'h-auto' to ensure it grows
                            className="bg-gray-900 w-full max-w-2xl rounded-xl shadow-lg border border-blue-800 transition-all duration-300 cursor-pointer h-auto"
                            
                            onClick={() => setExpanded(isExpanded ? null : event._id)}
                        >
                            <img
                                src={event.banner}
                                alt={event.title}
                                className={`w-full h-36 object-cover ${isPast ? "opacity-60" : ""}`}
                            />

                            {/* 3. Use the safe 'isExpanded' boolean we calculated above */}
                            {isExpanded && (
                                <div className="flex justify-between p-4 cursor-default border-t border-blue-800" onClick={(e) => e.stopPropagation()}>
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-200 mb-1">{event.title}</h3>
                                        <p className="text-sm text-blue-300 mb-1">
                                            {formatDate(event.date)} • {event.venue}
                                        </p>
                                        <p className="text-blue-100 mb-4">{event.description}</p>
                                    </div>
                                    {!isPast && (
                                        <div className="flex items-end mb-4">
                                            <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                                                Register
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    )
}
