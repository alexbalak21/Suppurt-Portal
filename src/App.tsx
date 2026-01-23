import "./App.css"
import {Routes, Route} from "react-router-dom"
import Navbar from "./components/Navbar"
import About from "./pages/About"
import Demo from "./pages/Demo"
import Login from "./pages/Login"

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Issue Tracker</h1>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}
