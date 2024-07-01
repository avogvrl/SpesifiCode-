import * as vscode from 'vscode'
import { getAIPoweredBotResponse } from './aiIntegration'


//Typing effect
async function typeTextInEditor(editor: vscode.TextEditor, text: string){
	for(let i=0; i<text.length; i++){
		//adjust the delay of text
		await new Promise(resolve =>setTimeout(resolve, 50))
		editor.edit(editBuilder =>{
			editBuilder.insert(editor.selection.active, text[i])
		})
	}
}



//Handle user input
async function handleUserInput(){
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
	const botResponse = await getAIPoweredBotResponse(prompt)

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


	//Simulate typing affect for the bot response
	await typeTextInEditor(editor, botResponse)

	//Display completion
	vscode.window.showInformationMessage('Response is received and typed')

}

export function active(context: vscode.ExtensionContext){
	let disposable = vscode.commands.registerCommand('extension.getAIPoweredBotResponse', async()=>{
		await handleUserInput()
	})
	context.subscriptions.push(disposable)
}