interface GlobalData {
    question: string;
    facts: string[];
    status: string;
}

// Extend the globalThis object to include your custom data
declare global {
    var storedData: GlobalData | undefined;
}

// Make sure this file is treated as a module
export {};