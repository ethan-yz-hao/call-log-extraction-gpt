import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Input from '@/app/components/Input';

describe('Input Component', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            json: () => Promise.resolve({ message: 'Success' }),
            ok: true
        })));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders without crashing', () => {
        render(<Input />);
        expect(screen.getByPlaceholderText('Type your question here...')).toBeInTheDocument();
    });

    it('validates question input field', async () => {
        render(<Input />);
        const input = screen.getByPlaceholderText('Type your question here...');
        fireEvent.input(input, { target: { value: 'Hi' } });
        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));
        expect(await screen.findByText('Question must be at least 4 characters long')).toBeInTheDocument();
    });

    it('adds and removes a document URL', async () => {
        render(<Input />);
        userEvent.click(screen.getByText('Add URL'));
        await waitFor(() => {
        expect(screen.getAllByPlaceholderText('Enter URL here...').length).toBe(1);
        }, { timeout: 1500 });

        const deleteButtons = screen.getAllByLabelText('Delete URL');
        userEvent.click(deleteButtons[0]);
        await waitFor(() => {
            expect(screen.queryByPlaceholderText('Enter URL here...')).toBeNull();
        }, { timeout: 1500 });
    });

    it('submits the form with valid data', async () => {
        render(<Input />);
        fireEvent.input(screen.getByPlaceholderText('Type your question here...'), {
            target: { value: 'Valid question?' }
        });
        userEvent.click(screen.getByText('Add URL'));
        await waitFor(() => {
            fireEvent.input(screen.getByPlaceholderText('Enter URL here...'), {
                target: { value: 'https://www.example.com' }
            });
        }, { timeout: 1500 });
        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith('/submit_question_and_documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documents: ['https://www.example.com'],
                    question: 'Valid question?'
                })
            });
        });
    });
});
