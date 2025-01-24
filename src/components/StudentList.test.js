import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react';
import StudentList from './StudentList';

const mockStudents = [
    { id: 1, firstName: 'John', lastName: 'Doe', checkInTime: '2025-01-01 08:00' },
    { id: 2, firstName: 'Jane', lastName: 'Doe', checkInTime: '2025-01-02 09:00' }
];

// Adding a delay in the mock fetch to simulate loading
global.fetch = jest.fn((url) => {
    if (url === '/students') {
        return new Promise((resolve) =>
            setTimeout(() => resolve({ json: () => Promise.resolve(mockStudents) }), 100) // simulate a delay
        );
    }
    if (url.startsWith('/students/')) { // Mocking the delete request
        return Promise.resolve({
            ok: true,
        });
    }
    return Promise.reject('Unknown URL');
});

describe('StudentList Component', () => {
    it('renders loading state initially', async () => {

        await act(async () => {
            render(<StudentList />, { wrapper: Router });
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays the list of students once loaded', async () => {

        await act(async () => {
            render(<StudentList />, { wrapper: Router });
        });

        await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());
        expect(screen.getByText('Jane')).toBeInTheDocument();
    });

    it('removes a student from the list when delete button is clicked', async () => {

        await act(async () => {
            render(<StudentList />, { wrapper: Router });
        });

        await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument());

        // Find the delete button for John
        const deleteButton = screen.getAllByText('Delete')[0];

        // Simulate the click on the delete button
        await act(async () => {
            fireEvent.click(deleteButton);
        });

        // Check that John is removed from the DOM, and Jane is still there
        await waitFor(() => {
            expect(screen.queryByText('John')).toBeNull();
            expect(screen.getByText('Jane')).toBeInTheDocument();
        });
    });
});
