import Sidebar from "./components/sidebar"

const App = () => {
  return (
    <div className="flex">
    <Sidebar />
      <div className="flex-1 min-h-screen bg-lightblue flex items-center
      justify-center">
        <h1 className="text-3x1 font-bold">The Greatest Cat Ever</h1>
      </div>
    </div>
  
  )
}



export default App