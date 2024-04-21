# Call Log Extration GPT

## Demo
[https://call-log-extraction-gpt.vercel.app/](https://call-log-extraction-gpt.vercel.app/)

## Features
Given a question, the application summarizes the fact of the call log data using GPT-4 API.
 - A interactive, user-friendly interface for modifying the call log data URL via drag-and-drop, as well as adding and deleting entries.
 - Error handling for invalid or empty URLs, and unsupported log formats, with user feedback on errors.
 - "Step by step" approach of the call log extraction process, which involves sending previous facts and new logs to GPT-4 for adding, deleting, and modifying the facts.
 - Enhanced accuracy in data extraction by providing one-shot examples to GPT-4.

## Tech Stack
 - Built with Next.js.
 - Styling implemented using Chakra UI, Chakra-Icon, and Tailwind CSS. Featured react-beautiful-dnd (@hello-pangea/dnd's verison) for drag and drop call log list to facilitate interactive user experience.
 - Employed react-hook-form for form validation and submission.
 - Used global variable to simplify data storage and access, expedite the development process.
 - Templating via ejs to format prompts for the GPT-4 API.
 - Implemented polling mechanism to retrieve the result from the backend.
 - Deployed on Vercel for serverless operations.

## Testing
Vitest and Jest were used for testing core components like Input.tsx and Output.tsx:

```bash
npm run test
```

## Installation
Install dependencies with:
```bash
npm install
```
Adding OPENAI_API_KEY to .env file
```bash
OPENAI_API_KEY=your_openai_api_key
```

## Run the Application
Start the development server:
```bash
npm run dev
```