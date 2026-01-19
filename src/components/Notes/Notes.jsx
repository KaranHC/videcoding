import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useDebounce } from '../../hooks/useLocalStorage';
import './Notes.css';

function Notes() {
  const { state, dispatch } = useApp();
  const [localNotes, setLocalNotes] = useState(state.notes);
  const debouncedNotes = useDebounce(localNotes, 500);

  useEffect(() => {
    setLocalNotes(state.notes);
  }, [state.notes]);

  useEffect(() => {
    if (debouncedNotes !== state.notes) {
      dispatch({
        type: 'UPDATE_NOTES',
        payload: { notes: debouncedNotes },
      });
    }
  }, [debouncedNotes, dispatch, state.notes]);

  return (
    <div className="notes-panel">
      <div className="notes-header">
        <h2 className="notes-title">Notes</h2>
      </div>
      <div className="notes-content">
        <textarea
          className="notes-textarea"
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          placeholder="Write your notes here..."
        />
      </div>
    </div>
  );
}

export default Notes;
