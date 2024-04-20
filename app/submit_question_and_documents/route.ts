import {NextRequest, NextResponse} from "next/server";
import '../../lib/initGlobalStore';
import ejs from "ejs";

let currentAbortController: AbortController | null = null;

export function POST(request: NextRequest) {
    if (currentAbortController) {
        currentAbortController.abort();
    }

    currentAbortController = new AbortController();

    const response = NextResponse.json({message: "Request received, processing will start."}, {status: 200});

    request.json().then(body => {
        processDocuments(body, currentAbortController!.signal)
            .then(() => console.log("Finished processing documents"))
            .catch(err => console.error("Error during document processing:", err));
    });

    return response;
}

async function processDocuments(body: { question: string, documents: string[] }, signal: AbortSignal) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error("OpenAI API key not found");
        return;
    }
    global.storedData = {question: body.question, facts: [], status: "processing"};
    global.error = "";

    const {question, documents} = body;
    console.log("Starting document processing for:", documents);

    try {
        for (let i = 0; i < documents.length; i++) {
            if (signal.aborted) {
                console.log("Processing was aborted.");
                return;
            }

            const resDocument = await fetch(documents[i], { signal });
            if (!resDocument.ok) {
                throw new Error(`Failed to fetch document: HTTP status ${resDocument.status}`);
            }
            const documentText = await resDocument.text();
            const query = i === 0 ?
                generateFirstQuery(question, documentText) :
                generateSecondQuery(question, global.storedData.facts.join("\n"), documentText);

            const payload = {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a help assistant who is good at summarizing key facts from logs to answer a question."
                    },
                    {
                        role: "user",
                        content: [{
                            "type": "text",
                            "text": query
                        }]
                    }
                ],
                max_tokens: 5000
            };

            const resOpenAI = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload),
                signal,
            });
            if (!resOpenAI.ok) {
                const errorResponse = await resOpenAI.json();
                throw new Error(`OpenAI API error: ${errorResponse.error.message}`);
            }

            const data = await resOpenAI.json();
            console.log(data);

            if (signal.aborted) {
                console.log("Processing was aborted after receiving response.");
                return;
            }

            if (data.choices && data.choices.length > 0) {
                console.log("OpenAI response for document", i, ":", data.choices[0].message.content);
                global.storedData.facts = data.choices[0].message.content.split("\n");
            }
        }
        global.storedData.status = "done";
        console.log("Finished processing documents:", global.storedData);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error processing documents:", error.message);
            global.error = error.message;
        } else {
            console.error("Unexpected error:", error);
            global.error = "An unexpected error occurred";
        }
    }
}

const generateFirstQuery = (question: string, calls: string) => {
    const template = `
Example:
Question: What are our product design decisions?
Call logs:
00:01:11,430 --> 00:01:40,520
John: Hello, everybody. Let's start with the product design discussion. I think we should go with a modular design for our product. It will allow us to easily add or remove features as needed.

00:01:41,450 --> 00:01:49,190
Sara: I agree with John. A modular design will provide us with the flexibility we need. Also, I suggest we use a responsive design to ensure our product works well on all devices. Finally, I think we should use websockets to improve latency and provide real-time updates.

00:01:49,340 --> 00:01:50,040
Mike: Sounds good to me. I also propose we use a dark theme for the user interface. It's trendy and reduces eye strain for users. Let's hold off on the websockets for now since it's a little bit too much work.

Output:
The team has decided to go with a modular design for the product.
The team has decided to use a responsive design to ensure the product works well on all devices.
The team has decided to provide both dark and light theme options for the user interface.

Given the question, please summarize a list of facts from a list of call logs.
Note: List each fact in a new line, and do not write anything else.

Question: <%= question %>
Call logs:
<%= calls %>
`
    return ejs.render(template, {question, calls});
}

const generateSecondQuery = (question: string, previousFacts: string, newCalls: string) => {
    const template = `
Example:
Questions: What are our product design decisions?
Previous facts:
The team has decided to go with a modular design for the product.
The team has decided to use a responsive design to ensure the product works well on all devices.
The team has decided to use a dark theme for the user interface.
New call logs:
00:01:11,430 --> 00:01:40,520
John: After giving it some more thought, I believe we should also consider a light theme option for the user interface. This will cater to users who prefer a brighter interface.

00:01:41,450 --> 00:01:49,190
Sara: That's a great idea, John. A light theme will provide an alternative to users who find the dark theme too intense.

00:01:49,340 --> 00:01:50,040
Mike: I'm on board with that.

Output:
The team has decided to go with a modular design for the product.
The team has decided to use a responsive design to ensure the product works well on all devices.
The team has decided to provide both dark and light theme options for the user interface.

Given the question and the previous facts, please summarize a list of new facts from a list of new call logs.
Hint: Retain previous facts that do not get affected by the new logs, modify previous facts that get affected by the new logs, add new facts that are newly mentioned in the new logs, and remove previous facts if the new logs indicate that they are dropped.
Note: List each fact in a new line, and do not write anything else.

Questions: <%= question %>
Previous facts:
<%= previousFacts %>
New call logs:
<%= newCalls %>
`
    return ejs.render(template, {question, previousFacts, newCalls});
}