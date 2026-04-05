import { google } from 'googleapis';
import { getTokenFromAppwrite } from './helpers';

export default async function handler(req, res){
    const { accountId, filterId } = req.body;
    const token = await getTokenFromAppwrite(accountId);

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(token);
    const gmail = google.gmail({version:'v1', auth:oAuth2Client});

    try{
        await gmail.users.settings.filters.delete({userId:'me', id: filterId});
        res.json({success:true});
    } catch(err){
        res.status(400).json({success:false, error: err.message});
    }
}