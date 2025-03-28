export default (
  description: string,
  transcript: string
) => `Need to extract the recipe from the description and transcript of a video:
          
description: "${description}"  
transcript: "${transcript}"  

### Instructions:  
- Extract only the recipe information, ignoring social media prompts, sponsorships, and unrelated content.  
- The result should be an **array** to support multiple recipes in the same video.  
- Structure the JSON output into five main sections:  
  - **intro**: Free text introducing the recipe.  
  - **ingredients**: An array of objects, each containing:  
    - "name": The ingredient name.  
    - "quantity": The total quantity if mentioned.  
  - **steps**: An array of ordered steps for preparation.  
  - **tips**: An array of useful tips related to the recipe, extracted from the video.  
  - **outro**: Free text after the recipe.  

### Parsing Considerations:  
- Prioritize ingredient quantities from the **description**, as they are often more precise than the transcript.  
- If an ingredient appears multiple times, **sum up the total quantity** and list it once.  
- Extract **useful tips** about the recipe that may appear throughout the video and add them to the "tips" section.  
- Remove any promotional or irrelevant content.  
- The **JSON keys** must be in **English (en-US)**, but the **values** (intro, outro, ingredients, quantities, steps, tips) should be in **Portuguese (pt-BR)**.  
- Return the **final result as a valid JSON object** with no additional text.  

### JSON Output Format Example:  

\`\`\`json
[
  {
    "intro": "Aqui está uma deliciosa receita de bolo de cenoura!",
    "ingredients": [
      { "name": "cenoura ralada", "quantity": "2 xícaras" },
      { "name": "farinha de trigo", "quantity": "3 xícaras" },
      { "name": "açúcar", "quantity": "2 xícaras" },
      { "name": "ovos", "quantity": "3 unidades" },
      { "name": "óleo", "quantity": "1 xícara" }
    ],
    "steps": [
      "Preaqueça o forno a 180°C.",
      "Bata no liquidificador as cenouras, ovos e óleo até obter uma mistura homogênea.",
      "Adicione o açúcar e bata novamente.",
      "Transfira para uma tigela e misture a farinha de trigo e o fermento com uma espátula.",
      "Despeje a massa em uma forma untada e asse por aproximadamente 40 minutos.",
      "Deixe esfriar antes de desenformar e servir."
    ],
    "tips": [
      "Se quiser um bolo mais fofinho, peneire a farinha antes de misturar.",
      "Use cenouras frescas para um sabor mais intenso.",
      "Se o bolo começar a dourar muito rápido, cubra com papel alumínio para evitar que queime."
    ],
    "outro": "Agora é só aproveitar esse bolo incrível!"
  }
]
\`\`\`
`;
