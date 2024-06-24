import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const url = 'data.json';
fetch(url)
  .then(response => response.json())
  .then(data => {
    let counter = 1; // Global counter for numbering
    async function generateStory() {
      const prompt = document.getElementById("in").value;
      if (prompt.length === 0) {
        alert("Please fill the input field");
        return;
      }
    
      const node = document.createElement("div");
      node.className = "question";
      const textnode = document.createTextNode(prompt);
      node.appendChild(textnode);
      document.getElementById("story").appendChild(node);
    
      // Create a loading indicator element
      const loadingElement = document.createElement("div");
      loadingElement.classList.add("loading");
      loadingElement.id = "loads";
    
      // Add three dots using a loop
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot"); // Add a class for styling (optional)
        loadingElement.appendChild(dot);
      }
    
      document.getElementById("story").appendChild(loadingElement);
    
      //Auto scroll down
      function scroll() {
        const disp = document.getElementById("story");
        disp.scrollTo(0, disp.scrollHeight);  
      }
      setTimeout(scroll,10);
    
      document.getElementById("in").value = "";
      const apiKey = data.zerd; // Replace with your actual API key
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
    
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
    
        // Replace single line breaks with paragraphs with numbering and h1 headers
        const storyText = text.split(/\n/).map((line) => {
          let content = line.trim(); // Trim leading/trailing whitespace
    
          if (line.startsWith("**")) {
            // Add numbering before h1 content
            content = `<h1 class="answer-header"><b>${counter}.</b> ${content.slice(2)}</h1>`;
            counter++; // Increment counter for next line
          } else {
            // Wrap paragraphs in p tags
            content = `<p class="answer-paragraph">${content}</p>`;
          }
          return content;
        }).join("");
    
        // Clear the existing "answer" div (if present) and create a new one
        const answerDiv = document.getElementById("answer") || document.createElement("div");
        answerDiv.className = "answer";
        answerDiv.innerHTML = "";
        
        // Append the generated story to the "answer" div
        answerDiv.innerHTML = storyText.replaceAll("**", "");
    
        if (storyText.includes("Gemini")) { // Check if "Gemini" exists first
          let temp = storyText.replace("Gemini", "Zerd");
          answerDiv.innerHTML = temp.replace("Google", "EZ"); // Combine replacements if needed
        }
    
        // Remove the loading indicator after successful generation
        document.getElementById("story").removeChild(loadingElement);
    
        // Append the "answer" div to the desired container (replace "new-div-section" if needed)
        document.getElementById("story").appendChild(answerDiv);
    
        // Auto scroll down
        setTimeout(scroll,10000);
    
      } catch (error) {
        console.error("Error generating story:", error);
        alert("An error occurred while generating the story. Please try again later.");
    
        // Remove the loading indicator even on error
        document.getElementById("story").removeChild(loadingElement);
      }
      counter = 1;
    }
    
    const btn = document.getElementById("sub");
    btn.addEventListener("click", generateStory);
    
    const wage = document.getElementById("in");
    wage.addEventListener("keydown", function (e) {
      if (e.code === "Enter") {
        generateStory();
      }
    });
    
  })
  .catch(error => console.error(error));
