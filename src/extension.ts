import { commands, ExtensionContext, window } from "vscode";
import { ICPWebViewProvider } from "./panels/HelloWorldPanel";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const provider = new ICPWebViewProvider(context.extensionUri);

  context.subscriptions.push(
    window.registerWebviewViewProvider(ICPWebViewProvider.viewType, provider)
  );
}
