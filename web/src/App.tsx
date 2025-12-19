// import { model } from "./model"
import { LoginPresenter } from "./presenters/LoginPresenter"
import { NavbarPresenter } from "./presenters/navbarPresenter"
import { TravelInfoPresenter } from "./presenters/TravelInfoPresenter"
import { UserInfoPresenter } from "./presenters/UserInfoPresenter"
import { PodcastPresenter } from "./presenters/PodcastPresenter"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <NavbarPresenter/>
      <Routes>
        <Route path="/" element={<LoginPresenter />} />
        <Route path="/travel" element={<TravelInfoPresenter />} />
        <Route path="/users" element={<UserInfoPresenter />} />
        <Route path="/podcasts" element={<PodcastPresenter />} />
      </Routes>
    </>
  )
}

export default App
