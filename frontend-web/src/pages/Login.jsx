// frontend-web/src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../assets/Logo_Prevensap.jpg'; // Importar el logo

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", { email, password });
      const { token, user } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard", { replace: true });
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error al iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <div style={{ backgroundColor: '#0052cc' }} className="flex flex-col items-center justify-center h-screen">
      
      <img src={logo} alt="Prevensap Logo" className="w-40 h-40 mb-5" />
      
      <h2 className="text-4xl font-bold text-center text-white mb-6">Prevensap</h2>

      <form onSubmit={handleLogin} className="p-8 rounded w-96 space-y-4">
        {error && <p className="text-yellow-300 text-sm text-center">{error}</p>}
        
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 border rounded bg-white text-gray-800" 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 border rounded bg-white text-gray-800" 
          required 
        />
        
        <button 
          type="submit" 
          className="w-full text-black py-3 rounded font-bold" 
          style={{ backgroundColor: '#FFC107' }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
