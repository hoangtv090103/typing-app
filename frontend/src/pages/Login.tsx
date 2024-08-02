import axios from "axios";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

interface LoginProps {
  setIsLogged: (arg0: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLogged }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log(email, password);
      const response = await axios.post("/api/v1/users/login", {
        email,
        password,
      });

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      setIsLogged(true);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false); 
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
