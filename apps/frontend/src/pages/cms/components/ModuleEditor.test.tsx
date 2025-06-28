import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ModuleEditor from './ModuleEditor';

vi.mock('../../../components/AppIcon', () => ({ default: () => <svg aria-hidden='true'></svg> }));

describe('ModuleEditor', () => {
  test('disables save button while saving', async () => {
    let resolveSave;
    const onSave = vi.fn(
      () =>
        new Promise(r => {
          resolveSave = r;
        })
    );
    render(<ModuleEditor module={{}} onSave={onSave} onDelete={() => {}} />);
    const saveButton = screen.getByRole('button', { name: 'Enregistrer' });
    fireEvent.click(saveButton);
    expect(onSave).toHaveBeenCalled();
    expect(saveButton).toBeDisabled();
    resolveSave();
    await waitFor(() => expect(saveButton).not.toBeDisabled());
  });
});
