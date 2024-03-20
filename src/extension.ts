import { commands, ExtensionContext, window, workspace } from "vscode";
import { ICPWebViewProvider } from "./panels/HelloWorldPanel";
import * as fs from "fs";
import * as path from "path";

export function activate(context: ExtensionContext) {
  if (isDfxProject()) {
    console.log("here");
    commands.executeCommand("setContext", "icp.showExplorer", true);
  }

  // Create the show hello world command
  const provider = new ICPWebViewProvider(context.extensionUri);

  context.subscriptions.push(
    window.registerWebviewViewProvider(ICPWebViewProvider.viewType, provider)
  );

  if (isDfxProject()) {
    console.log("here");
    commands.executeCommand("setContext", "icp.showExplorer", true);
  }

  context.subscriptions.push(
    commands.registerCommand("icp-toolkit.helloWorld", () => {
      provider.postMessage("Hello World");
    })
  );
}

function isDfxProject() {
  const rootPath =
    workspace.workspaceFolders && workspace.workspaceFolders.length > 0
      ? workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  if (!rootPath) return false;

  return fs.existsSync(path.join(rootPath, "dfx.json"));
}
