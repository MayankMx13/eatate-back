import { Link, useNavigate } from "react-router-dom";
import "./loginpage.scss";
import apiRequest from "../../lib/apiRequest.js"
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";


function Login() {

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const { updateUser } = useContext(AuthContext)
    const navigate = useNavigate("/register");

    const handleSubmit = async (e) => {

        e.preventDefault();
        setIsLoading(true);
        setError("");
        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");
        try {

            const res = await apiRequest.post("/auth/login", {
                username, password,
            })

            updateUser(res.data)


            navigate("/")

        }
        catch (err) {
            console.log(err)
            setError(err.response.data.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="login">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Welcome Back</h1>
                    <input name="username" required minLength={3} maxLength={20} type="username" placeholder="Username" />
                    <input name="password" required type="password" placeholder="Password" />
                    <button disabled={isLoading}>Login</button>
                    {error && <span>{error}</span>}
                    <Link to="/register">{"Don't"} you have an account?</Link>
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    )
}


export default Login;