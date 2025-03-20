import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  START,
  END,
  StateGraph,
  MemorySaver,
  MessagesAnnotation,
  Annotation,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
  ],
  ["placeholder", "{messages}"],
]);

// Define the state
const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  language: Annotation<string>(),
});

// Define the function that calls the model
const callModel = async (state: typeof GraphAnnotation.State) => {
  const prompt = await promptTemplate.invoke(state);
  const response = await llm.invoke(prompt);
  return { messages: [response] };
};

const workflow = new StateGraph(GraphAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const app = workflow.compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: uuidv4() } };
const input = {
  messages: [
    {
      role: "user",
      content: "Hi im bob",
    },
  ],
  language: "Spanish",
};
const output = await app.invoke(input, config);
console.log(output.messages[output.messages.length - 1].content);
// ¡Hola, Bob! ¿Cómo puedo ayudarte hoy?

const input2 = {
  messages: [
    {
      role: "user",
      content: "What is my name?",
    },
  ],
};
const output2 = await app.invoke(input2, config);
console.log(output2.messages[output2.messages.length - 1].content);
// Tu nombre es Bob. ¿Hay algo más en lo que pueda ayudarte?
