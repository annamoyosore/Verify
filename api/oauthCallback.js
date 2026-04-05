import { google } from 'googleapis';
import { Client, Databases, ID } from 'node-appwrite';

export default async function handler(req, res) {
    try {
        // ✅ Step 1: Get OAuth code from Google
        const code = req.query.code;

        if (!code) {
            return res.status(400).send("❌ Missing OAuth code");
        }

        // ✅ Step 2: Setup Google OAuth client
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        // ✅ Step 3: Exchange code for tokens
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // ✅ Step 4: Get Gmail user profile
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const profile = await gmail.users.getProfile({ userId: 'me' });

        const email = profile.data.emailAddress;

        // ✅ Step 5: Setup Appwrite client
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT)
            .setProject(process.env.APPWRITE_PROJECT_ID)
            .setKey(process.env.APPWRITE_API_KEY);

        const databases = new Databases(client);

        // ✅ Step 6: Save account + token in Appwrite
        await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_ACCOUNTS_COLLECTION,
            ID.unique(), // safer than using email as ID
            {
                email: email,
                token: tokens
            }
        );

        // ✅ Step 7: Redirect to dashboard
        return res.redirect('/frontend/dashboard.html');

    } catch (error) {
        console.error("❌ OAuth Error:", error);

        return res.status(500).json({
            success: false,
            message: "OAuth failed",
            error: error.message
        });
    }
}