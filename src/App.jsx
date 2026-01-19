import { useState } from 'react';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import TodoList from './components/TodoList/TodoList';
import Notes from './components/Notes/Notes';
import AddTaskModal from './components/AddTaskModal/AddTaskModal';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">Vibe Board</h1>
        <button
          className="add-task-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Task
        </button>
      </header>

      <main className="main-content">
        <div className="kanban-section">
          <KanbanBoard />
        </div>
        <aside className="sidebar">
          <TodoList />
          <Notes />
        </aside>
      </main>

      {isModalOpen && (
        <AddTaskModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default App;
