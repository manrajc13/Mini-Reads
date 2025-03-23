import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
// import './index.css'
import App from "./App.jsx"
import { ClerkProvider } from "@clerk/clerk-react"
const PUBLISHABLE_KEY = "pk_test_ZnJhbmsta3JpbGwtNjQuY2xlcmsuYWNjb3VudHMuZGV2JA"



if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file")
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>,
)

