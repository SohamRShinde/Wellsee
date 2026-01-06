import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import api from "../api.js"

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  
  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      console.log(response.data.user)
      setUser(response.data.user);
      setData({
        email: '',
        password: '',
      });
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold justify-center mb-4">Login</h2>
          
          <form onSubmit={loginUser} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={e => setData({...data, email: e.target.value})}
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
                onChange={e => setData({...data, password: e.target.value})}
                className="input input-bordered w-full"
                required
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <div className="divider"></div>
          
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}