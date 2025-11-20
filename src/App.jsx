import Nav from "./components/Nav";
import Jumbotron from "./components/Jumbotron";
import SoundSection from "./components/SoundSection";
import DisplaySection from "./components/DisplaySection";
import WebgiViewer from "./components/WebgiViewer";
import { useRef } from "react";


function App() {

  const webgiViewerRef = useRef(null);
  const contentRef = useRef(null);

  const handlePreview = () => {
    webgiViewerRef.current.triggerPreview();
  }

  return (
    <div className="App">
      <div id="content" ref={contentRef}>
        <Nav></Nav>
        <Jumbotron></Jumbotron>
        <SoundSection></SoundSection>
        <DisplaySection triggerPreview={handlePreview}></DisplaySection>
      </div>
     
      <WebgiViewer contentRef={contentRef} src="scene-black.glb" width="100%" height="100%" ref={webgiViewerRef}></WebgiViewer>
    </div>
  );
}

export default App;
