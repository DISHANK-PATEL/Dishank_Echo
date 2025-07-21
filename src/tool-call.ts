import { MongoClient } from "mongodb";

function buildPodcastQueryFromMessage(message: string): object {
    // Extracts the name before 'podcast details' in the message
    const match = message.match(/fetch me (.+) podcast details/i);
    if (match && match[1]) {
        const name = match[1].trim();
        return {
            $or: [
                { title: { $regex: name, $options: "i" } },
                { description: { $regex: name, $options: "i" } }
            ]
        };
    }
    // Default: return all
    return {};
}

export default async function toolCall(paramOne: string, paramTwo: string, envVar: string): Promise<string> {
    // --- MongoDB connection test ---
    try {
        const client = new MongoClient(envVar);
        await client.connect();
        await client.close();
        return "MongoDB connection successful!";
    } catch (err: any) {
        return `MongoDB connection failed: ${err.message}`;
    }

    /*
    // --- Original logic commented out for testing ---
    console.log('paramOne:', paramOne);
    let result = '';

    // Normalize mode: trim, lowercase, replace spaces with underscores
    const normalizedMode = paramOne.trim().toLowerCase().replace(/\s+/, '_');

    if (normalizedMode === 'podcast_nl') {
        // paramTwo is the user's message, envVar is the MongoDB URI
        try {
            const query = buildPodcastQueryFromMessage(paramTwo);
            console.log('MongoDB Query:', JSON.stringify(query));
            const client = new MongoClient(envVar);
            await client.connect();
            const db = client.db();
            const coll = db.collection('podcasts');
            const data = await coll.find(query).limit(10).toArray();
            console.log('MongoDB Data:', data);
            result = JSON.stringify(data, null, 2);
            await client.close();
        } catch (err: any) {
            console.error('MongoDB Error:', err); // Log full error
            result = `MongoDB Error: ${err.message}`;
        }
    } else if (normalizedMode === 'mongo') {
        try {
            const { collection, query } = JSON.parse(paramTwo);
            const client = new MongoClient(envVar);
            await client.connect();
            const db = client.db(); // Uses DB from connection string
            const coll = db.collection(collection);
            const data = await coll.find(query).limit(10).toArray();
            result = JSON.stringify(data, null, 2);
            await client.close();
        } catch (err: any) {
            console.error('MongoDB Error:', err); // Log full error
            result = `MongoDB Error: ${err.message}`;
        }
    } else {
        console.log(`Received event with the following parameters: ${paramOne}, ${paramTwo} and the following env var: ${envVar}.`)
        result = paramOne + paramTwo;
    }

    return result;
    */
}