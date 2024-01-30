const fs = require('fs');
const { google } = require('googleapis');
const readline = require('readline');
const { promisify } = require('util');
const { createReadStream } = require('fs');
const ProgressBar = require('progress');

const readFileAsync = promisify(fs.readFile);

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'C:/Users/syafi/OneDrive/Documents/Day23/token.js'; // Save token to avoid re-authentication every time

async function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const token = await readFileAsync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch (err) {
        return getAccessToken(oAuth2Client);
    }
}

async function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this URL:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const code = await new Promise((resolve) => {
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            resolve(code);
        });
    });
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    return oAuth2Client;
}

async function uploadFolder(auth) {
    const drive = google.drive({ version: 'v3', auth });
    const folderId = '1osssI90rA08SAZeiCX7zGVso4ahSWC6r'; // ID of the folder in Google Drive where you want to upload
    const folderPath = 'C:/Users/syafi/AppData/Roaming/RenPy/Monika After Story'; // Path to the folder you want to upload

    // Step 1: List all files in the folder and delete them
    await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
    }).then(async (response) => {
        for (const file of response.data.files) {
            await drive.files.delete({
                fileId: file.id,
            });
        }
    });

    // Step 2: Upload new content
    const files = fs.readdirSync(folderPath);
    const totalFiles = files.length;
    let uploadedFiles = 0;

    const bar = new ProgressBar('Uploading [:bar] :percent    ', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: totalFiles,
    });

    for (const file of files) {
        const filePath = `${folderPath}/${file}`;
        const media = {
            mimeType: 'application/octet-stream',
            body: createReadStream(filePath),
        };

        await drive.files.create({
            requestBody: {
                name: file,
                parents: [folderId],
            },
            media,
        });

        uploadedFiles++;
        bar.update(uploadedFiles / totalFiles);
    }

    console.log('\nFolder uploaded successfully.');
}

async function main() {
    try {
        const credentials = JSON.parse(await readFileAsync('C:/Users/syafi/OneDrive/Documents/Day23/credentials.json')); // rename path to your path
        const auth = await authorize(credentials);
        await uploadFolder(auth);
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
