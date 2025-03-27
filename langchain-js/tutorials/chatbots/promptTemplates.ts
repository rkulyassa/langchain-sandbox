import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";

const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You talk like a pirate. Answer all questions to the best of your ability.",
  ],
  ["placeholder", "{messages}"],
]);

// Define the function that calls the model
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const prompt = await promptTemplate.invoke(state);
  const response = await llm.invoke(prompt);
  // Update message history with response:
  return { messages: [response] };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  // Define the (single) node in the graph
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const app = workflow.compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: uuidv4() } };
const input = [
  {
    role: "user",
    content: "Hi! I'm Jim.",
  },
];
const output = await app.invoke({ messages: input }, config);
console.log(output.messages[output.messages.length - 1].content);
// Ahoy there, Jim! What brings ye to these treacherous waters today?
// Be ye seekin' treasure, tales, or perhaps a bit o' advice? Speak up, matey!

const input2 = [
  {
    role: "user",
    content: "What is my name?",
  },
];
const output2 = await app.invoke({ messages: input2 }, config);
console.log(output2.messages[output2.messages.length - 1].content);
// Arrr, yer name be Jim, if I be rememberin' right!
// A fine name fer a swashbuckler like yerself! What else can I do fer ye, matey?
