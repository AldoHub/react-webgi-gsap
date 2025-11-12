import Nav from "./components/Nav";
import Jumbotron from "./components/Jumbotron";
import SoundSection from "./components/SoundSection";
import DisplaySection from "./components/DisplaySection";
import WebgiViewer from "./components/WebgiViewer";


function App() {

  return (
    <div className="App">
      <Nav></Nav>
      <Jumbotron></Jumbotron>
      <SoundSection></SoundSection>
      <DisplaySection></DisplaySection>
      <WebgiViewer src="scene-black.glb" width="100%" height="100%"></WebgiViewer>
    </div>
  );
}

export default App;
