import { google } from 'googleapis';
import { getTokenFromAppwrite, updateFilterStatus } from './helpers';

export default async function handler(req, res){
    const { accountId, sender, forwardTo } = req.body;
    const token = await getTokenFromAppwrite(accountId);

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(token);
    const gmail = google.gmail({version:'v1', auth:oAuth2Client});

    try{
        await gmail.users.settings.filters.create({
            userId:'me',
            requestBody:{ criteria:{ from: sender }, action:{ forward: forwardTo } }
        });
        await updateFilterStatus(accountId, sender, forwardTo, 'success');
        res.json({ success:true });
    } catch(err){
        await updateFilterStatus(accountId, sender, forwardTo, 'failed');
        res.json({ success:false, error: err.message });
    }
}