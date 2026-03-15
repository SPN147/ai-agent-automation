const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "us-east-1"
});

async function decideLink(instruction, links) {

    const prompt = `
You are an AI website navigation assistant.

User instruction:
${instruction}

Available links:
${links.join("\n")}

Choose the best matching link.

Rules:
- Return ONLY the exact link text
- Do NOT explain
- Output exactly one link from the list
`;

    const body = JSON.stringify({
        messages: [
            {
                role: "user",
                content: [
                    {
                        text: prompt
                    }
                ]
            }
        ],
        inferenceConfig: {
            maxTokens: 20,
            temperature: 0
        }
    });

    const command = new InvokeModelCommand({
        modelId: "us.amazon.nova-lite-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: body
    });

    const response = await client.send(command);

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    let result = responseBody.output.message.content[0].text.trim();

    result = result.split("\n")[0].trim();

    return result;
}

module.exports = { decideLink };