const { Pinecone } = require("@pinecone-database/pinecone");

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatGptIndexDB = pc.Index("chat-gpt");

// Insert method
const upsertChatMessageVector = async ({ vectors, metadata, messageId }) => {
  try {
    const res = await chatGptIndexDB.upsert([
      {
        id: messageId,
        values: vectors,
        metadata,
      },
    ]);
    console.log("Inserted vectors into Pinecone DB:", res);
  } catch (err) {
    console.error("Error inserting vectors:", err);
  }
};

const querySimilarChatVectors = async ({
  queryVectors,
  limit = 5,
  metadata,
}) => {
  try {
    const data = await chatGptIndexDB.query({
      vector: queryVectors,
      topK: limit,
      includeMetadata: true,
    });

    return data.matches;
  } catch (err) {
    console.error("Error querying vectors:", err);
    return [];
  }
};

module.exports = { upsertChatMessageVector, querySimilarChatVectors };
