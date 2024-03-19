import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { spawn } from "child_process";

export class CanisterProvider implements vscode.TreeDataProvider<Canister> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: Canister): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Canister): Thenable<Canister[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No canisters in empty workspace");
      return Promise.resolve([]);
    }

    if (!element) {
      const child = spawn("dfx",["canister", "status", "--all"] { cwd: this.workspaceRoot });

      child.stdout.on("data", (data) => {
        console.log(`stdout:\n${data}`);
      });

      child.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      return Promise.resolve([]);
    }

    return Promise.resolve([]);
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private getDepsInPackageJson(packageJsonPath: string): Canister[] {
    if (this.pathExists(packageJsonPath)) {
      const toDep = (moduleName: string, version: string): Canister => {
        if (
          this.pathExists(
            path.join(this.workspaceRoot, "node_modules", moduleName)
          )
        ) {
          return new Canister(
            moduleName,
            version,
            vscode.TreeItemCollapsibleState.Collapsed
          );
        } else {
          return new Canister(
            moduleName,
            version,
            vscode.TreeItemCollapsibleState.None
          );
        }
      };

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

      const deps = packageJson.dependencies
        ? Object.keys(packageJson.dependencies).map((dep) =>
            toDep(dep, packageJson.dependencies[dep])
          )
        : [];
      const devDeps = packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).map((dep) =>
            toDep(dep, packageJson.devDependencies[dep])
          )
        : [];
      return deps.concat(devDeps);
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}

class Canister extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
  }
}
