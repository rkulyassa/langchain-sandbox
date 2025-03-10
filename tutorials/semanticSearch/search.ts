import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  apiKey: process.env.QDRANT_API_KEY,
  url: process.env.QDRANT_URL,
  collectionName: "langchainjs-testing",
});

// const results1 = await vectorStore.similaritySearch(
//   "When was Nike incorporated?"
// );
// console.log(results1[0]);

// const results2 = await vectorStore.similaritySearchWithScore(
//   "What was Nike's revenue in 2023?"
// );
// console.log(results2[0]);

const retriever = vectorStore.asRetriever({
  k: 1,
  searchType: "mmr",
  searchKwargs: {
    fetchK: 10,
  },
});

const result = await retriever.invoke("What was Nike's revenue in 2023?");
console.log(result);

// console.log(
//   await retriever.batch([
//     "When was Nike incorporated?",
//     "What was Nike's revenue in 2023?",
//   ])
// );
