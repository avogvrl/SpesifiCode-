import axios from "axios";



async function getSpecifiCodeAIResponse(prompt: string): Promise<string>{
    const apiUrl= "https://spesificode.onrender.com"
    
    try{
        const response = await axios.post(apiUrl, {prompt})
        return response.data.bot.trim;
    }
    catch(error){
        console.error("Error Fetching Response:", error)
        return 'Something went wrong'

    }
}

export { getSpecifiCodeAIResponse }