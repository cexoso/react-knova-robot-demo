import { WindowStage } from "./components/stage";

function App() {
  return (
    <div className="App">
      <WindowStage width={window.innerWidth} height={window.innerHeight} />
    </div>
  );
}

export default App;
