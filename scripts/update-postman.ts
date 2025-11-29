import * as fs from 'fs';
import * as path from 'path';
// @ts-expect-error: openapi-to-postmanv2 kütüphanesinin type tanımları eksik
import Converter from 'openapi-to-postmanv2';

interface PostmanCollection {
  info: {
    name: string;
    [key: string]: unknown;
  };
  item: unknown[];
  [key: string]: unknown;
}

interface ConversionResult {
  result: boolean;
  reason?: string;
  output: { type: string; data: PostmanCollection }[];
}

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

function convertToPostman(data: string): Promise<PostmanCollection> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    Converter.convert({ type: 'string', data }, {}, (err: unknown, conversion: ConversionResult) => {
      if (err) {
        if (err instanceof Error) {
          return reject(err);
        }

        return reject(new Error(String(err as string)));
      }

      if (conversion.result) {
        resolve(conversion.output[0].data);
      } else {
        reject(new Error(conversion.reason || 'Unknown conversion error'));
      }
    });
  });
}

bootstrap().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error('Script failed:', err.message);
  } else {
    console.error('Script failed:', String(err));
  }
  process.exit(1);
});
