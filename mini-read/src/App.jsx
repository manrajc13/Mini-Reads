import { BookListProvider } from "../src/context/BookListContext"
import Home from "../src/components/Home"
import Navbar from "../src/components/Navbar"
import "./App.css"

function App() {
  return (
    <div className="app">
      <BookListProvider>
        <Navbar />
        <Home />
      </BookListProvider>
    </div>
  )
}

export default App
