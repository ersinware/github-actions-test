import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import Converter from 'openapi-to-postmanv2';

const [, , openApiPath, collectionId, branchName] = process.argv;
const apiKey = process.env.POSTMAN_API_KEY;

if (!openApiPath || !collectionId || !apiKey) {
    console.error('Missing arguments or API key.');
    console.error('Usage: npx ts-node update-postman.ts <path-to-json> <collection-id> <branch-name>');

    process.exit(1);
}

async function bootstrap() {
    const openApiData = fs.readFileSync(path.resolve(openApiPath!), 'utf8');
    const postmanCollection = await convertToPostman(openApiData);

    if (branchName) {
        const originalName = postmanCollection.info.name;
        const suffix = branchName.toUpperCase();
        postmanCollection.info.name = `${originalName} - ${suffix}`;
    }

    const response = await fetch(`https://api.getpostman.com/collections/${collectionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey as string,
        },
        body: JSON.stringify({ collection: postmanCollection }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API responded with ${response.status}: ${errorBody}`);
    }

    console.log('Postman Collection updated successfully!');
}

function convertToPostman(data: string): Promise<any> {
    return new Promise(function (resolve, reject) {
        Converter.convert(
            { type: 'string', data },
            {},
            function (_: any, conversion: any) {
                if (conversion.result) {
                    resolve(conversion.output[0].data);
                } else {
                    reject(conversion.reason);
                }
            }
        );
    });
}

bootstrap().catch((err) => {
    console.error('Script failed:', err.message || err);
    process.exit(1);
});