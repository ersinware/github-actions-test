import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore: ignoring because openapi-to-postmanv2 type definitions are missing
import Converter from 'openapi-to-postmanv2';

const openApiPath = process.argv[2];
const collectionId = process.argv[3];
const apiKey = process.env.POSTMAN_API_KEY;

if (!openApiPath) {
  console.error('Error: OpenAPI file path argument is missing.');
  console.error('Usage: npx ts-node scripts/update-postman.ts <path-to-json> <collection-id>');

  process.exit(1);
}

if (!collectionId) {
  console.error('Error: Collection ID argument is missing.');
  console.error('Usage: npx ts-node scripts/update-postman.ts <path-to-json> <collection-id>');

  process.exit(1);
}

if (!apiKey) {
  console.error('Error: Environment variable POSTMAN_API_KEY is required.');
  
  process.exit(1);
}

async function main() {
    try {
        const openApiData = fs.readFileSync(path.resolve(openApiPath), 'utf8');
        const postmanCollection = await convertOpenApiToPostman(openApiData);

        await updatePostmanCollection(collectionId, postmanCollection);
    } catch (error) {
        console.error('Script execution failed:', error);

        process.exit(1);
    }
}

function convertOpenApiToPostman(data: string): Promise<any> {
    return new Promise((resolve, reject) => {
        Converter.convert(
            { type: 'string', data },
            {},
            (err: any, conversionResult: any) => {
                if (!conversionResult.result) {
                    reject(new Error(`Could not convert OpenAPI to Postman: ${conversionResult.reason}`));
                } else {
                    resolve(conversionResult.output[0].data);
                }
            }
        );
    });
}

async function updatePostmanCollection(uid: string, collectionData: any) {
    console.log(`Updating Postman Collection (${uid})...`);

    const response = await fetch(`https://api.getpostman.com/collections/${uid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey as string,
        },
        body: JSON.stringify({ collection: collectionData }),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));

        console.error(`Error updating Postman Collection! Status: ${response.status}`);
        console.error(JSON.stringify(errorBody, null, 2));

        throw new Error(`Postman API responded with status ${response.status}`);
    }

    console.log('Postman Collection updated successfully!');
}

main();