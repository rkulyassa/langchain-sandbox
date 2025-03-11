import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const taggingPrompt = ChatPromptTemplate.fromTemplate(
  `Extract the desired information from the following passage.

Only extract the properties mentioned in the 'Classification' function.

Passage:
{input}
`
);

const classificationSchema = z.object({
  sentiment: z
    .enum(["happy", "neutral", "sad"])
    .describe("The sentiment of the text"),
  aggressiveness: z
    .number()
    .int()
    // .min(1)
    // .max(10)
    .describe(
      "describes how aggressive the statement is on a scale of 1 to 5, the higher the number the more aggressive"
    ),
  language: z
    .enum(["spanish", "english", "french", "german", "italian"])
    .describe("The language the text is written in"),
});

const llmWithStructuredOutput = llm.withStructuredOutput(classificationSchema, {
  name: "extractor",
});

const prompt = await taggingPrompt.invoke({
  input:
    "Estoy increiblemente contento de haberte conocido! Creo que seremos muy buenos amigos!",
});
// const response = await llmWithStructuredOutput.invoke(prompt1);
// console.log(response);

const prompt2 = await taggingPrompt.invoke({
  input: "Estoy muy enojado con vos! Te voy a dar tu merecido!",
});
// const response = await llmWithStructuredOutput.invoke(prompt2);
// console.log(response);

const prompt3 = await taggingPrompt.invoke({
  input: "Weather is ok here, I can go outside without much more than a coat",
});
const response = await llmWithStructuredOutput.invoke(prompt3);
console.log(response);
