import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

// Test inputs
const section = "end";
const query = "Task Decomposition";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL,
  collectionName: "langchainjs-testing2-QA",
});

const filter = {
  must: [
    {
      key: "metadata.section",
      match: {
        value: section,
      },
    },
  ],
};

const retrievedDocs = await vectorStore.similaritySearch(query, 2, filter);

console.log(retrievedDocs);
