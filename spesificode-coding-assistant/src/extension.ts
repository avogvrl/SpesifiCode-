// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { getSpecifiCodeAIResponse } from './aiIntregation'
import { resolve } from 'path';


//Typing effect
async function typeTextInEditor(editor:vscode.TextEditor, text: string){
	for(let i=0; i<text.length; i++){
		//Adjust the delay of text
		await new Promise(resolve =>setTimeout(resolve, 50))
		editor.edit(editBuilder =>{
			editBuilder.insert(editor.selection.active, text[i])
		})
	}
	
}

//Handle user input

async function handleUserInput() {
	const prompt = await vscode.window.showInputBox({
		prompt: "Please enter your prompt"
	})

	//If user cancels the input
	if(prompt === undefined){
		return;
	}

	//Get active text editor
	const editor = vscode.window.activeTextEditor

	if(!editor){
		return
	}

	//Display loading message
	editor.edit( editBuilder =>{
		editBuilder.insert(editor.selection.active, 'Fetching Response ...')
	})

	//Fetch bot response
	const botResponse = await getSpecifiCodeAIResponse(prompt)

	//Remove loading message
	const loadingMessageLength = 'Fetching Response ...'.length

	editor.edit(editBuilder=>{
		editBuilder.delete(
			new vscode.Range(
				editor.selection.active.translate(0, -loadingMessageLength),
				editor.selection.active
			)
		)
	})

	//Simulate typing effect for the bot response
	await typeTextInEditor(editor, botResponse)

	//display completion 
	vscode.window.showInformationMessage('The response is received and typed. Thankyou!')
	
}

export function activate(context: vscode.ExtensionContext){
	let disposable = vscode.commands.registerCommand('extension.getSpecifiCodeAIResponse', async ()=>{
		await handleUserInput()
	})
	context.subscriptions.push(disposable)
}

