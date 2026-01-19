import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './TodoList.css';

function TodoList() {
  const { state, dispatch } = useApp();
  const { todos } = state;
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch({
        type: 'ADD_TODO',
        payload: { text: newTodo.trim() },
      });
      setNewTodo('');
    }
  };

  const handleToggle = (id) => {
    dispatch({
      type: 'TOGGLE_TODO',
      payload: { id },
    });
  };

  const handleDelete = (id) => {
    dispatch({
      type: 'DELETE_TODO',
      payload: { id },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd(e);
    }
  };

  return (
    <div className="todo-panel">
      <div className="todo-header">
        <h2 className="todo-title">Quick Tasks</h2>
      </div>
      <div className="todo-content">
        <form onSubmit={handleAdd} className="todo-form">
          <input
            type="text"
            className="todo-input"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a quick task..."
          />
        </form>
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="todo-empty">No tasks yet</li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <label className="todo-label">
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                  />
                  <span className="todo-text">{todo.text}</span>
                </label>
                <button
                  className="todo-delete"
                  onClick={() => handleDelete(todo.id)}
                  aria-label="Delete task"
                >
                  &times;
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
