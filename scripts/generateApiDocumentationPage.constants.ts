// TODO: Write as MDX and import it in the script
export const API_DOCS_INTRO = `
The Botpress API is a RESTful set of HTTP endpoints that allow you to create, deploy, and run chatbots on the [Botpress Cloud](https://botpress.com/).

It can be used to create and manage bots, handle conversations and messages, as well as to manage their content, users, and configuration.

The base URL of the Botpress Cloud API is: \`https://api.botpress.com\`

The API endpoints will expect the \`Content-type: application/json\` HTTP header to be present in the request and  the request body (if any) to be in JSON format, and will send back the same header in the response and return a JSON response body as well.
`

export const API_DOCS_AUTHENTICATION = `
To authenticate with the Botpress Cloud API, you'll need to use one of the methods below to obtain an access token.

These tokens can be used as a Bearer token to call all the endpoints of the API, by passing the following HTTP header to the API endpoints:

\`\`\`
Authorization: Bearer {ACCESS_TOKEN}
\`\`\`

<H4> Identity Token </H4>
- **Personal Access Token (PAT)**: Can be generated in the **Profile Settings** section of your [Botpress Cloud account](https://app.botpress.cloud).
- **Bot Token**: This will be provided to the bot (once deployed) in the \`BP_TOKEN\` environment variable.
- **Integration Token**: This will be provided to the integration (once deployed) in the \`BP_TOKEN\` environment variable.
`

export const API_DOCS_PAGINATION = `
The "List" endpoints of our API will return paginated results based on the creation date of the resource, with a default limit of 20 results per page.

When the number of results exceeds the limit, the response body will include a \`meta.nextToken\` property that can be passed as a query string parameter (e.g. \`endpoint?nextToken={nextToken}\`) to retrieve the next page of results.

If there are no more results, the endpoint will not provide a \`nextToken\` value.

<H4> Example: </H4>

1. Call the \`/v1/chat/conversations\` endpoint to obtain the first page of results:

\`\`\`json
{
  "conversations": [
    (...)
  ],
  "meta": {
    "nextToken": "wwNgQn6tWNR/IHhKGHv/sg9zcIAGsxOk0TfmM+DdmcWkBZrXYjVvcfSZIZSs4ppCr/g="
  }
}
\`\`\`

2. Call the endpoint again but now passing the \`nextToken\` as a query string parameter, making sure the value is **URL-encoded**:

\`\`\`
/v1/chat/conversations?nextToken=wwNgQn6tWNR%2FIHhKGHv%2Fsg9zcIAGsxOk0TfmM%2BDdmcWkBZrXYjVvcfSZIZSs4ppCr%2Fg%3D
\`\`\`

3. Repeat until the response body doesn't provide a \`nextToken\` value anymore:

\`\`\`json
{
  "conversations": [
    (...)
  ],
  "meta": {}
}
\`\`\`
`

export const API_DOCS_ERROR_DESCRIPTION = `
If an error occurs when calling an API endpoint, the response will return the appropriate HTTP status code
as indicated below and the response body will be one of the following JSON objects indicating the nature
of the error:
`
