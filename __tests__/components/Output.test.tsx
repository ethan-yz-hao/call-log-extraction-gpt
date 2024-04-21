import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Output from '../../app/components/Output';
import {GlobalData} from "@/types/global"; // Adjust the import path according to your project structure

vi.mock("../../app/components/DataDisplay", () => ({
    __esModule: true,
    default: ({ data }: {data: GlobalData}) => <div>Displayed Data: {JSON.stringify(data)}</div>
}));
vi.mock("../../app/components/ErrorDisplay", () => ({
    __esModule: true,
    default: ({ error }: {error: string}) => <div>Error: {error}</div>
}));

describe('Output Component', () => {
    beforeEach(() => {
        global.fetch = vi.fn((input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
            const url = typeof input === 'string' || input instanceof URL ? input.toString() : input.url;
            switch (url) {
                case '/get_question_and_facts':
                    return Promise.resolve(new Response(JSON.stringify({
                        status: "complete",
                        question: "What is Next.js?",
                        facts: ["Next.js is a React framework", "It is used for server-side rendering"]
                    }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                case '/get_error':
                    return Promise.resolve(new Response(JSON.stringify({
                        message: 'Not found'
                    }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                default:
                    return Promise.resolve(new Response(null, { status: 404 }));
            }
        });
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('displays loading initially', async () => {
        render(<Output />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('handles error from the fetch', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve(new Response(null, {
                status: 404,
                statusText: 'Not Found'
            }))
        );

        render(<Output />);
        vi.advanceTimersByTime(1000);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('continuously fetches data every second', async () => {
        render(<Output />);
        expect(fetch).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(1000); // Advance by 1 second
        expect(fetch).toHaveBeenCalledTimes(2);
        vi.advanceTimersByTime(1000); // Another second
        expect(fetch).toHaveBeenCalledTimes(3);
    });
});
