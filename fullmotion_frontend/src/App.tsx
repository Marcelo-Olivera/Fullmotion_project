import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import Header from "./components/Header"
import Inicio from "./pages/Inicio"
import AgendarAvaliacao from "./pages/AgendarAvaliacao";
import Login from "./pages/Login";
import Footer from "./components/Footer";

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agendar" element={<AgendarAvaliacao />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
