import { model } from "./model"
import { LoginPresenter } from "./presenters/loginPresenter"

function App() {
  return (
    <>
      <LoginPresenter model={model} />
    </>
  )
}

export default App
