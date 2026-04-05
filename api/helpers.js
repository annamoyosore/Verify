import sdk from 'node-appwrite';

const client = new sdk.Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const database = new sdk.Databases(client, process.env.APPWRITE_DATABASE_ID);

export async function getTokenFromAppwrite(accountId){
    const doc = await database.getDocument(process.env.APPWRITE_ACCOUNTS_COLLECTION, accountId);
    return doc.token;
}

export async function updateFilterStatus(accountId, sender, forwardTo, status){
    // optional: save status in Appwrite filters collection
    // implement as needed
    return;
}

export async function listAccountsFromAppwrite(){
    const docs = await database.listDocuments(process.env.APPWRITE_ACCOUNTS_COLLECTION);
    return docs.documents;
}