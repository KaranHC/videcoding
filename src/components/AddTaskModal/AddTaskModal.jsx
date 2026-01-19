import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './AddTaskModal.css';

function AddTaskModal({ onClose }) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState('todo');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch({
        type: 'ADD_CARD',
        payload: {
          columnId: column,
          title: title.trim(),
          description: description.trim(),
        },
      });
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} onKeyDown={handleKeyDown}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add Task</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details (optional)"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label htmlFor="column" className="form-label">Column</label>
              <select
                id="column"
                className="form-select"
                value={column}
                onChange={(e) => setColumn(e.target.value)}
              >
                <option value="todo">Todo</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;
