import { useState, useCallback } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar" // Import your existing Navbar
import Sidebar from "./Sidebar" // Import the new Sidebar

export default function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Function to toggle the sidebar state
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev)
    }, [])

    return (
        <div className="min-h-screen bg-base-300">
            {/* Navbar is always visible */}
            <Navbar onToggleSidebar={toggleSidebar} /> 
            
            {/* Sidebar component, passing state and close function */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                onToggle={toggleSidebar} 
            />

            {/* Main Content Area */}
            <main className="p-4 pt-10">
                {/* The Outlet is where your routed pages (Home, Profile, etc.) render */}
                <Outlet />
            </main>
        </div>
    )
}