import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "./components/sidebar"
import Dashboard from "./pages/Dashboard"
import Assets from "./pages/Assets"

const App = () => {
  return (
    <Router>
      <div className="flex h-screen ">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
          </Routes>
        </div>
        </div>
    </Router>
  )
}



export default App