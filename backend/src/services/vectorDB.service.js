const { Pinecone } = require("@pinecone-database/pinecone");

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatGptIndexDB = pc.Index("chat-gpt");

const insertVectors = async ({ vectors, metadata, messageId }) => {
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

const queryVectors = async ({ queryVectors, limit = 5, filter }) => {
  try {
    const data = await chatGptIndexDB.query({
      vector: queryVectors,
      topK: limit,
      filter: filter || undefined,
    });

    return data.matches;
  } catch (err) {
    console.error("Error querying vectors:", err);
    return [];
  }
};

module.exports = { insertVectors, queryVectors };
