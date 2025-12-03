import { model } from "./model"
import { LoginPresenter } from "./presenters/loginPresenter"
import { NavbarPresenter } from "./presenters/navbarPresenter"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <NavbarPresenter/>
      <Routes>
        <Route path="/" element={<LoginPresenter />} />
      </Routes>
    </>
  )
}

export default App
