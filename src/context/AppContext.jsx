import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';

const AppContext = createContext(null);

const initialState = {
  kanban: {
    columns: {
      todo: { id: 'todo', title: 'Todo', cardIds: [] },
      progress: { id: 'progress', title: 'In Progress', cardIds: [] },
      done: { id: 'done', title: 'Done', cardIds: [] },
    },
    columnOrder: ['todo', 'progress', 'done'],
    cards: {},
  },
  todos: [],
  notes: '',
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_CARD': {
      const { columnId, title, description } = action.payload;
      const cardId = generateId();
      const newCard = {
        id: cardId,
        title,
        description: description || '',
        createdAt: Date.now(),
      };
      return {
        ...state,
        kanban: {
          ...state.kanban,
          cards: {
            ...state.kanban.cards,
            [cardId]: newCard,
          },
          columns: {
            ...state.kanban.columns,
            [columnId]: {
              ...state.kanban.columns[columnId],
              cardIds: [...state.kanban.columns[columnId].cardIds, cardId],
            },
          },
        },
      };
    }

    case 'UPDATE_CARD': {
      const { cardId, title, description } = action.payload;
      return {
        ...state,
        kanban: {
          ...state.kanban,
          cards: {
            ...state.kanban.cards,
            [cardId]: {
              ...state.kanban.cards[cardId],
              title,
              description,
            },
          },
        },
      };
    }

    case 'DELETE_CARD': {
      const { cardId, columnId } = action.payload;
      const newCards = { ...state.kanban.cards };
      delete newCards[cardId];
      return {
        ...state,
        kanban: {
          ...state.kanban,
          cards: newCards,
          columns: {
            ...state.kanban.columns,
            [columnId]: {
              ...state.kanban.columns[columnId],
              cardIds: state.kanban.columns[columnId].cardIds.filter(id => id !== cardId),
            },
          },
        },
      };
    }

    case 'MOVE_CARD': {
      const { cardId, sourceColumnId, destColumnId, sourceIndex, destIndex } = action.payload;

      if (sourceColumnId === destColumnId) {
        const column = state.kanban.columns[sourceColumnId];
        const newCardIds = Array.from(column.cardIds);
        newCardIds.splice(sourceIndex, 1);
        newCardIds.splice(destIndex, 0, cardId);

        return {
          ...state,
          kanban: {
            ...state.kanban,
            columns: {
              ...state.kanban.columns,
              [sourceColumnId]: {
                ...column,
                cardIds: newCardIds,
              },
            },
          },
        };
      }

      const sourceColumn = state.kanban.columns[sourceColumnId];
      const destColumn = state.kanban.columns[destColumnId];
      const sourceCardIds = Array.from(sourceColumn.cardIds);
      const destCardIds = Array.from(destColumn.cardIds);

      sourceCardIds.splice(sourceIndex, 1);
      destCardIds.splice(destIndex, 0, cardId);

      return {
        ...state,
        kanban: {
          ...state.kanban,
          columns: {
            ...state.kanban.columns,
            [sourceColumnId]: {
              ...sourceColumn,
              cardIds: sourceCardIds,
            },
            [destColumnId]: {
              ...destColumn,
              cardIds: destCardIds,
            },
          },
        },
      };
    }

    case 'ADD_TODO': {
      const todo = {
        id: generateId(),
        text: action.payload.text,
        completed: false,
        createdAt: Date.now(),
      };
      return {
        ...state,
        todos: [...state.todos, todo],
      };
    }

    case 'TOGGLE_TODO': {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    }

    case 'DELETE_TODO': {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    }

    case 'UPDATE_NOTES': {
      return {
        ...state,
        notes: action.payload.notes,
      };
    }

    case 'LOAD_STATE': {
      return { ...initialState, ...action.payload };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    }
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
