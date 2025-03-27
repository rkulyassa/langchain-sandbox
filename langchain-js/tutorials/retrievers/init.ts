import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

const loader = new PDFLoader("data/nke-10k-2023.pdf");
const docs = await loader.load();

const textsplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const allSplits = await textsplitter.splitDocuments(docs);

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

// const vector1 = await embeddings.embedQuery(allSplits[0].pageContent);
// const vector2 = await embeddings.embedQuery(allSplits[1].pageContent);
// console.assert(vector1.length === vector2.length);
// console.log(`Generated vectors of length ${vector1.length}\n`);
// console.log(vector1.slice(0, 10));

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  apiKey: process.env.QDRANT_API_KEY,
  url: process.env.QDRANT_URL,
  collectionName: "langchainjs-testing",
});

await vectorStore.addDocuments(allSplits);
