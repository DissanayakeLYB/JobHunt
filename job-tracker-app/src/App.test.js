import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from './App';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage and reset the app state before each test
    localStorageMock.clear();
    // Note: If App component initializes state from localStorage directly (not via useEffect delay),
    // you might need to re-render or ensure localStorage is set *before* initial render for some tests.
  });

  test('renders the application header', () => {
    render(<App />);
    expect(screen.getByText(/Job Application Tracker/i)).toBeInTheDocument();
  });

  test('can add a new job application', () => {
    render(<App />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Company Name:/i), { target: { value: 'Test Company' } });
    fireEvent.change(screen.getByLabelText(/Position:/i), { target: { value: 'Test Position' } });
    fireEvent.click(screen.getByText(/Add Application/i));

    // Check if the application appears in the list
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Test Position')).toBeInTheDocument();
  });

  test('can delete a job application', async () => {
    render(<App />);

    // Add an application first
    fireEvent.change(screen.getByLabelText(/Company Name:/i), { target: { value: 'Company To Delete' } });
    fireEvent.change(screen.getByLabelText(/Position:/i), { target: { value: 'Position To Delete' } });
    fireEvent.click(screen.getByText(/Add Application/i));

    // Ensure it's added
    expect(screen.getByText('Company To Delete')).toBeInTheDocument();

    // Delete the application
    // Assuming delete buttons are identifiable, e.g., by text or a more specific selector if needed
    // For simplicity, if there's only one delete button after adding one item:
    fireEvent.click(screen.getByText('Delete'));

    // Check if the application is removed
    // Use waitFor to handle potential async state updates
    await waitFor(() => {
      expect(screen.queryByText('Company To Delete')).not.toBeInTheDocument();
    });
  });

  test('can filter applications by status', async () => { // Made this async
    const { container } = render(<App />); // get container for within queries

    const form = container.querySelector('form'); // Get the form element

    // Add first application
    fireEvent.change(screen.getByLabelText(/Company Name:/i), { target: { value: 'Company A' } });
    fireEvent.change(screen.getByLabelText(/Position:/i), { target: { value: 'Dev A' } });
    // Use a more specific selector for the form's status field, scoped to the form
    fireEvent.change(within(form).getByLabelText(/Status:/i), { target: { value: 'Applied' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Application/i }));


    // Add second application
    fireEvent.change(screen.getByLabelText(/Company Name:/i), { target: { value: 'Company B' } });
    fireEvent.change(screen.getByLabelText(/Position:/i), { target: { value: 'Dev B' } });
    // Use a more specific selector for the form's status field, scoped to the form
    fireEvent.change(within(form).getByLabelText(/Status:/i), { target: { value: 'Interviewing' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Application/i }));

    await waitFor(() => {
        expect(screen.getByText('Company A')).toBeInTheDocument();
        expect(screen.getByText('Company B')).toBeInTheDocument();
    });

    // Filter by 'Applied' - Use specific selector for filter dropdown
    fireEvent.change(screen.getByLabelText(/Filter by Status:/i), { target: { value: 'Applied' } });

    await waitFor(() => {
        expect(screen.getByText('Company A')).toBeInTheDocument();
        expect(screen.queryByText('Company B')).not.toBeInTheDocument();
    });

    // Filter by 'Interviewing'
    fireEvent.change(screen.getByLabelText(/Filter by Status:/i), { target: { value: 'Interviewing' } });

    await waitFor(() => {
        expect(screen.queryByText('Company A')).not.toBeInTheDocument();
        expect(screen.getByText('Company B')).toBeInTheDocument();
    });

    // Reset to 'All'
    fireEvent.change(screen.getByLabelText(/Filter by Status:/i), { target: { value: 'All' } });
    await waitFor(() => {
        expect(screen.getByText('Company A')).toBeInTheDocument();
        expect(screen.getByText('Company B')).toBeInTheDocument();
    });
  });

  test('can edit an application', async () => {
    const { rerender } = render(<App />); // Use rerender for cleaner state updates if needed

    // Add an application
    fireEvent.change(screen.getByLabelText(/Company Name:/i), { target: { value: 'Initial Company' } });
    fireEvent.change(screen.getByLabelText(/Position:/i), { target: { value: 'Initial Position' } });
    // The button is initially "Add Application"
    fireEvent.click(screen.getByRole('button', { name: /Add Application/i }));

    await waitFor(() => expect(screen.getByText('Initial Company')).toBeInTheDocument());

    // Click edit button - be more specific if multiple edit buttons
    // Assuming the table row context makes this specific enough, or use `within`
    const row = screen.getByText('Initial Company').closest('tr');
    fireEvent.click(within(row).getByText('Edit'));


    await waitFor(() => {
        expect(screen.getByLabelText(/Company Name:/i).value).toBe('Initial Company');
        expect(screen.getByLabelText(/Position:/i).value).toBe('Initial Position');
        // Button text should now be "Update Application"
        expect(screen.getByRole('button', { name: /Update Application/i })).toBeInTheDocument();
    });

    // Change the data
    fireEvent.change(screen.getByLabelText(/Company Name:/i), { target: { value: 'Updated Company' } });
    fireEvent.change(screen.getByLabelText(/Position:/i), { target: { value: 'Updated Position' } });
    // Click the "Update Application" button
    fireEvent.click(screen.getByRole('button', { name: /Update Application/i }));

    await waitFor(() => {
        expect(screen.queryByText('Initial Company')).not.toBeInTheDocument();
        expect(screen.getByText('Updated Company')).toBeInTheDocument();
        expect(screen.getByText('Updated Position')).toBeInTheDocument();
    });

    // After update, form should reset and button should revert to "Add Application"
    expect(screen.getByLabelText(/Company Name:/i).value).toBe('');
    expect(screen.getByRole('button', { name: /Add Application/i })).toBeInTheDocument();
  });


  test('data persists in localStorage and loads on mount', async () => {
    // Initial render and add data
    const { unmount } = render(<App />);

    fireEvent.change(screen.getByLabelText(/Company Name:/i), { target: { value: 'Persistent Company' } });
    fireEvent.change(screen.getByLabelText(/Position:/i), { target: { value: 'Persistent Position' } });
    // Ensure the button is the correct one if its text changes
    fireEvent.click(screen.getByRole('button', {name: /Add Application/i}));

    await waitFor(() => {
      const storedData = JSON.parse(localStorageMock.getItem('jobApplications'));
      expect(storedData).toHaveLength(1);
      expect(storedData[0].companyName).toBe('Persistent Company');
    });

    // Unmount the component
    unmount();

    // Re-render the component - this simulates a fresh load
    render(<App />);

    // Data should be loaded from localStorage
    await waitFor(() => {
        // Use getAllByText if duplicates are possible but acceptable in this check, or ensure uniqueness
        expect(screen.getByText('Persistent Company')).toBeInTheDocument();
        expect(screen.getByText('Persistent Position')).toBeInTheDocument();
    });

    // Verify there's only one instance in the table if that's the expectation
    // This helps catch issues where data might be duplicated on load
    const companyCells = screen.getAllByText('Persistent Company');
    // Depending on how it's rendered (e.g. if company name appears in multiple table cells for some reason)
    // This might need adjustment. Assuming it's unique per row in the relevant column.
    expect(companyCells.filter(cell => cell.tagName === 'TD')).toHaveLength(1);
  });

});
