import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import useMessage from "./hooks/useMessage";

function App() {
  const message = useMessage();

  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  return (
    <main>
      <p>
        In order to use the ICP explorer, you need to open a folder containing an ICP project or
        initialize a new ICP project
      </p>
      <VSCodeButton onClick={handleHowdyClick}>Initialize a new project</VSCodeButton>
    </main>
  );
}

export default App;
