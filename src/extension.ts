// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "tsf.convertToTemplateString",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage(
          "Open a file to convert strings to template strings."
        );
        return;
      }

      const document = editor.document;
      const selections = editor.selections;

      editor.edit((editBuilder) => {
        selections.forEach((selection) => {
          const range = getEnclosingStringRange(document, selection.active);
          if (range) {
            const text = document.getText(range);
            // Convert the string into a template string by replacing quotes with backticks.
            const newText = text.replace(/^(['"])(.*)\1$/, "`$2`");
            editBuilder.replace(range, newText);
            vscode.window.showInformationMessage(
              "formatted to template string literal"
            );
          }
        });
      });
    }
  );

  context.subscriptions.push(disposable);
}

function getEnclosingStringRange(document: vscode.TextDocument, position: vscode.Position) {
    const lineText = document.lineAt(position.line).text;
    let startQuotePos = -1;
    let endQuotePos = -1;
    let quoteChar = '';

    // Look backward from the cursor for the start quote
    for (let i = position.character - 1; i >= 0; i--) {
        if (lineText[i] === '"' || lineText[i] === "'") {
            startQuotePos = i;
            quoteChar = lineText[i];
            break;
        }
    }

    // Look forward from the cursor for the end quote of the same type
    for (let i = position.character; i < lineText.length; i++) {
        if (lineText[i] === quoteChar) {
            endQuotePos = i;
            break;
        }
    }

    if (startQuotePos !== -1 && endQuotePos !== -1 && quoteChar) {
        // Create a range that includes the quotes
        return new vscode.Range(position.line, startQuotePos, position.line, endQuotePos + 1);
    }

    return null;
}


// This method is called when your extension is deactivated
export function deactivate() {}
