import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useState } from "react";

function App() {
  const [isLogged, setIsLogged] = useState(
    localStorage.getItem("token") || false,
  );
  return (
    <>
      <Routes>
        {isLogged ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Login setIsLogged={setIsLogged} />} />
        )}
      </Routes>
    </>
  );
}

export default App;
