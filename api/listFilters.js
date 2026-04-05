import { google } from 'googleapis';
import { getTokenFromAppwrite } from './helpers';

export default async function handler(req, res){
    const { accountId } = req.body;
    const token = await getTokenFromAppwrite(accountId);

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(token);
    const gmail = google.gmail({version:'v1', auth:oAuth2Client});

    try{
        const response = await gmail.users.settings.filters.list({userId:'me'});
        res.json(response.data);
    } catch(err){
        res.status(400).json({error: err.message});
    }
}