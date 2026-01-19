import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../../context/AppContext';

function Card({ card, columnId, isDragging: isOverlay }) {
  const { dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      dispatch({
        type: 'UPDATE_CARD',
        payload: {
          cardId: card.id,
          title: editTitle.trim(),
          description: editDescription.trim(),
        },
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(card.title);
    setEditDescription(card.description);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this card?')) {
      dispatch({
        type: 'DELETE_CARD',
        payload: { cardId: card.id, columnId },
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="card" ref={setNodeRef} style={style}>
        <div className="card-edit-form">
          <input
            type="text"
            className="card-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Card title"
            autoFocus
          />
          <textarea
            className="card-edit-textarea"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="card-edit-actions">
            <button className="card-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="card-btn"
              onClick={handleSave}
              style={{ background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  const className = [
    'card',
    isDragging ? 'is-dragging' : '',
    isOverlay ? 'is-overlay' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      {...attributes}
      {...listeners}
    >
      <div className="card-title">{card.title}</div>
      {card.description && (
        <div className="card-description">{card.description}</div>
      )}
      <div className="card-actions">
        <button className="card-btn" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button className="card-btn delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Card;
