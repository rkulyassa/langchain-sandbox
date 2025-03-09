import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];

// const response = await model.invoke(messages);
// console.log(response);

// const stream = await model.stream(messages);
// for await (const chunk of stream) {
//   console.log(`${chunk.content}|`);
// }

const systemTemplate = "Translate the following from English into {language}";

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);

const promptValue = await promptTemplate.invoke({
  language: "italian",
  text: "hi!",
});

console.log(promptValue.toChatMessages());
const response = await model.invoke(promptValue);
console.log(`${response.content}`);
