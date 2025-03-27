import { graphQA } from "./ragQA";

let inputsQA = {
  question: "What does the end of the post say about Task Decomposition?",
};

console.log(inputsQA);
console.log("\n====\n");
for await (const chunk of await graphQA.stream(inputsQA, {
  streamMode: "updates",
})) {
  console.log(chunk);
  console.log("\n====\n");
}
// https://smith.langchain.com/public/35fc625f-3546-4bac-9f9d-80506c2d8fcf/r
/*
The end of the post highlights that task decomposition is challenging for LLMs,
particularly in long-term planning and adjusting plans in response to unexpected errors.
It suggests that LLMs are less robust than humans in learning from trial and error during the task decomposition process.
Overall, effective exploration of the solution space remains a significant hurdle.
*/
