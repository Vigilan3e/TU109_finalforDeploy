import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import api from '../utils/api';

const Login = () => {

    const [email, setEmail] =useState("");
    const [password, setPassword] =useState("");
    const [error, setError] =useState(null);
    const [loading, setLoading] =useState(false);
    const navigate = useNavigate();

    const {login} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            console.info('[login] Sending request', `${api.defaults.baseURL}/api/auth/login`);
            const response = await api.post("/api/auth/login", {
                email,
                 password,
                }
            );
            console.info('[login] Response', {
                status: response.status,
                success: response.data.success,
                message: response.data.message
            });

            if  (response.data.success) {
                await login(response.data.user, response.data.token);
                if(response.data.user.role === "admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/customer-dashboard");
                }
            } else {
                alert(response.data.error);
            }

        } catch (error) {
            const status = error.response?.status;
            const responseData = error.response?.data;
            console.error('[login] Request failed', {
                status,
                response: responseData,
                message: error.message
            });
            setError(responseData?.message || 'Unable to reach the login server');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-red-700 from-50% to-gray-100 to-50% space-y-6">
            <h1 className="text-3xl text-white font-serif">PigVillain Inventory Management System version 0.0.1</h1>
            <div className="border shadow-lg p-6 w-80 bg-white">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {error && (
                    <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-800">Email</label>
                        <input 
                        type="email"
                        className="w-full px-3 py-2 border"
                        name="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email"></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-800">Password</label>
                        <input
                        type="password"
                        className="w-full px-3 py-2 border"
                        name="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"></input>
                    </div>
                    <div className="mb-4">
                        <button
                        type="submit"
                        className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all duration-200 mt-2">{loading ? "Loading..." : "Login"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;