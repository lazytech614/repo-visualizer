import Header from "./components/global/Header"
import DependencyGraphPage from "./pages/dependencyGraphPage"
// import RepositoryPage from "./pages/repositoryPage"

const App = () => {
  return (
    <>
      <Header />
      {/*  <RepositoryPage /> */}
      <DependencyGraphPage />
    </>
  )
}

export default App