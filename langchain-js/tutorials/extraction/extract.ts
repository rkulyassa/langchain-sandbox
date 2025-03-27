import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const person = z.object({
  name: z.optional(z.string()).describe("The name of the person"),
  hair_color: z
    .optional(z.string())
    .describe("The color of the person's hair if known"),
  height_in_meters: z.number().nullish().describe("Height measured in meters"),
});

const dataSchema = z.object({
  people: z.array(person).describe("Extracted data about people"),
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert extraction algorithm.
Only extract relevant information from the text.
If you do not know the value of an attribute asked to extract,
return null for the attribute's value.`,
  ],
  ["human", "{text}"],
]);

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const structured_llm = llm.withStructuredOutput(dataSchema);

// const prompt = await promptTemplate.invoke({
//   text: "Alan Smith is 6 feet tall and has blond hair.",
// });
// const response = await structured_llm.invoke(prompt);
// console.log(response);

const prompt2 = await promptTemplate.invoke({
  text: "My name is Jeff, my hair is black and i am 6 feet tall. Anna has the same color hair as me.",
});

const response = await structured_llm.invoke(prompt2);
console.log(response);
