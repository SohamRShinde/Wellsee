import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../api.js"

export default function Register() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student"
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(data.password !== data.confirmPassword) {
            alert("Passwords do not match!")
            return 
        }
        setLoading(true)
        const {name, email, password, role} = data
        try {
            const res = await api.post("/api/auth/register", {
                name, email, password, role
            })
            alert(res.data.message)
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold justify-center mb-4">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value })}
                className="select select-bordered w-full"
              >
                <option value="student">Student</option>
                <option value="club_admin">Club Admin</option>
              </select>
            </div>

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="divider"></div>
          
          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}