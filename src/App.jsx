import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "./components/sidebar"
import Dashboard from "./pages/Dashboard"
import Header from "./components/Header"
import Assets from "./pages/Assets"
import AddUser from "./pages/AddUser"
import Settings from "./pages/Settings"
import Reports from "./pages/Reports"

const App = () => {
  return (
    <Router>
      <div className="flex h-screen ">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        </div>
        </div>
    </Router>
  )
}



export default App