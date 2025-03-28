import type { VideoData } from '../../proxies/youtube/types';

export default (
  VideoData: VideoData
) => `Need to extract the recipe from the description and transcript of a video:
          
Video data in JSON format:
\`\`\`json
"${JSON.stringify(VideoData, null, 2)}"
\`\`\`


### Instructions:  
- Extract only the recipe information, ignoring social media prompts, sponsorships, and unrelated content.  
- The result should be an **array** to support multiple recipes in the same video.  
- Structure the JSON output with the following fields:  
  - **title**: The title of the video, translated to **Portuguese (pt-BR)** if necessary.  
  - **author**: The name of the video author.  
  - **publishDate**: The publication date of the video.  
  - **videoUrl**: The original URL of the video.  
  - **channelUrl**: The URL of the author's channel.  
  - **intro**: Free text introducing the recipe.  
  - **ingredients**: An array of objects, each containing:  
    - "name": The ingredient name, **capitalized** (first letter uppercase).  
    - "quantity": The total quantity if mentioned.  
  - **steps**: An array of ordered steps for preparation.  
  - **tips**: An array of useful tips related to the recipe, extracted from the video.  
  - **outro**: Free text after the recipe.  

### Parsing Considerations:  
- **Translate the video title to Portuguese (pt-BR)** if it is in another language.  
- **Ensure that ingredient names are capitalized** (e.g., "farinha de trigo" → "Farinha de trigo").  
- Prioritize ingredient quantities from the **description**, as they are often more precise than the transcript.  
- If an ingredient appears multiple times, **sum up the total quantity** and list it once.  
- Extract **useful tips** about the recipe that may appear throughout the video and add them to the "tips" section.  
- Remove any promotional or irrelevant content.  
- The **JSON keys** must be in **English (en-US)**, but the **values** (title, intro, outro, ingredients, quantities, steps, tips) should be in **Portuguese (pt-BR)**.  
- Return the **final result as a valid JSON object** with no additional text.  

### JSON Output Format Example:  

\`\`\`json
[
  {
    "title": "Como Fazer um Bolo de Cenoura Perfeito",
    "author": "Receitas da Maria",
    "publishDate": "2024-03-15",
    "videoUrl": "https://www.youtube.com/watch?v=abc123",
    "channelUrl": "https://www.youtube.com/c/ReceitasDaMaria",
    "intro": "Aqui está uma deliciosa receita de bolo de cenoura!",
    "ingredients": [
      { "name": "Cenoura ralada", "quantity": "2 xícaras" },
      { "name": "Farinha de trigo", "quantity": "3 xícaras" },
      { "name": "Açúcar", "quantity": "2 xícaras" },
      { "name": "Ovos", "quantity": "3 unidades" },
      { "name": "Óleo", "quantity": "1 xícara" }
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
