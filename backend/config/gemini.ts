const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable.
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run(prompt: string | undefined) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (!prompt) {
      prompt = "Please generate random words for typing practice.";
    }

    console.log("Calling GenerateContent with prompt:", prompt);
    // TODO: Fix Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: Unable to connect. 
    // Is the computer able to access the url?
    const result = await model.generateContent(prompt);
    
    console.log("GenerateContent response:", result);

    const response = result.response;
    const text = response.text();

    return text;
  } catch (err: any) {
    console.error("Error generating text:", err.message);
    return err.message;
  }
}

module.exports = {
  run,
};
