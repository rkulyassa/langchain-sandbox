import { graph } from "./rag";

let inputs = { question: "What is Task Decomposition?" };

// const result = await graph.invoke(inputs);
// console.log(result.context.slice(0, 2));
// console.log(`\nAnswer: ${result["answer"]}`);
// https://smith.langchain.com/public/84a36239-b466-41bd-ac84-befc33ab50df/r

const stream = await graph.stream(inputs, { streamMode: "messages" });
for await (const [message, _metadata] of stream) {
  process.stdout.write(message.content + "|");
}
