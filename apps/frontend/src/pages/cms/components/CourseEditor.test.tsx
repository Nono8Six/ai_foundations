import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import CourseEditor from './CourseEditor';

// Mock Icon to simplify rendering
vi.mock('../../../components/AppIcon', () => ({ default: () => <svg aria-hidden='true'></svg> }));
vi.mock('../../../components/AppImage', () => ({ default: () => <img alt='' /> }));

describe('CourseEditor', () => {
  test('disables save button while saving', async () => {
    let resolveSave;
    const onSave = vi.fn(
      () =>
        new Promise(r => {
          resolveSave = r;
        })
    );
    render(<CourseEditor course={{}} onSave={onSave} onDelete={() => {}} />);
    const saveButton = screen.getByRole('button', { name: 'Enregistrer' });
    fireEvent.click(saveButton);
    expect(onSave).toHaveBeenCalled();
    expect(saveButton).toBeDisabled();
    resolveSave();
    await waitFor(() => expect(saveButton).not.toBeDisabled());
  });
});
