import { google } from 'googleapis';
import { Client, Databases } from 'node-appwrite';

const client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const database = new Databases(client, process.env.APPWRITE_DATABASE_ID);

export default async function handler(req, res){
    // OAuth redirect from Google
    const code = req.query.code;
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const gmail = google.gmail({version:'v1', auth:oAuth2Client});
    const profile = await gmail.users.getProfile({userId:'me'});

    // Save account + token in Appwrite
    await database.createDocument(
        process.env.APPWRITE_ACCOUNTS_COLLECTION,
        profile.data.email,
        { email: profile.data.email, token: tokens }
    );

    res.redirect('/frontend/dashboard.html');
}