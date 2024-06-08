# Call Log Extraction GPT

![Call Log Extraction GPT Home Page](https://raw.githubusercontent.com/ethan-yz-hao/call-log-extraction-gpt/main/images/home.png)

Given a question, the application summarizes the fact of the call log data using GPT-4 API. It enhances developers' productivity by offering developers summaries of call log data, which can be used for debugging, testing, and troubleshooting purposes.

Deploy on vercel [Call Log Extraction GPT](https://call-log-extraction-gpt.vercel.app/)

## Features
- **Interactive User Interface**: Enables modifying the call log data URL via a drag-and-drop interface, along with options for adding and deleting entries.
- **Error Handling**: Provides feedback for errors related to invalid URLs, empty inputs, or unsupported log formats.
- **Robust Extraction Process**: Implements a "step-by-step" approach by sending existing facts and new logs to GPT-4 for updates, ensuring high accuracy.
- **Enhanced Accuracy**: Improves extraction accuracy by providing one-shot examples to GPT-4.

## Technologies
- **Next.js**: Framework for building the user interface and server-side rendering.
- **Chakra UI, Chakra-Icon, Tailwind CSS & react-beautiful-dnd** Implement Styling Featured react-beautiful-dnd (@hello-pangea/dnd's verison) for drag and drop call log list to facilitate interactive user experience.
- **react-hook-form** for form validation and submission.
- **Global Variables**: Simplify data storage and access, expedite the development process.
- **EJS** For templating/formatting prompts for the GPT-4 API.
- **Polling Mechanism**: For retrieving the result/error from the backend.
- **Vercel**: Cloud platform for deploying and hosting the application.

## Testing
Vitest and Jest were used for testing core components like Input.tsx and Output.tsx:

```bash
npm run test
```

## Installation
1. Install dependencies:
   
   ```bash
   npm install
   ```
2. Set up environment variables:
   
   Adding OPENAI_API_KEY to .env file
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   ```
   
3. Start the development server
   Open http://localhost:3000 with your browser to see the result.
   ```bash
   npm run dev
   ```