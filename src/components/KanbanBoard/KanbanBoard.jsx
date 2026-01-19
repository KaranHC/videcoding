import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useApp } from '../../context/AppContext';
import Column from './Column';
import Card from './Card';
import './KanbanBoard.css';

function KanbanBoard() {
  const { state, dispatch } = useApp();
  const { kanban } = state;
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumnByCardId = (cardId) => {
    for (const columnId of kanban.columnOrder) {
      if (kanban.columns[columnId].cardIds.includes(cardId)) {
        return columnId;
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = findColumnByCardId(activeId);
    let overColumn = findColumnByCardId(overId);

    if (!overColumn) {
      overColumn = kanban.columnOrder.includes(overId) ? overId : null;
    }

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    const activeIndex = kanban.columns[activeColumn].cardIds.indexOf(activeId);
    let overIndex = kanban.columns[overColumn].cardIds.indexOf(overId);

    if (overIndex === -1) {
      overIndex = kanban.columns[overColumn].cardIds.length;
    }

    dispatch({
      type: 'MOVE_CARD',
      payload: {
        cardId: activeId,
        sourceColumnId: activeColumn,
        destColumnId: overColumn,
        sourceIndex: activeIndex,
        destIndex: overIndex,
      },
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = findColumnByCardId(activeId);
    let overColumn = findColumnByCardId(overId);

    if (!overColumn) {
      overColumn = kanban.columnOrder.includes(overId) ? overId : null;
    }

    if (!activeColumn || !overColumn) return;

    if (activeColumn === overColumn) {
      const activeIndex = kanban.columns[activeColumn].cardIds.indexOf(activeId);
      const overIndex = kanban.columns[overColumn].cardIds.indexOf(overId);

      if (activeIndex !== overIndex) {
        dispatch({
          type: 'MOVE_CARD',
          payload: {
            cardId: activeId,
            sourceColumnId: activeColumn,
            destColumnId: overColumn,
            sourceIndex: activeIndex,
            destIndex: overIndex,
          },
        });
      }
    }
  };

  const activeCard = activeId ? kanban.cards[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {kanban.columnOrder.map((columnId) => {
          const column = kanban.columns[columnId];
          const cards = column.cardIds.map((cardId) => kanban.cards[cardId]);

          return (
            <Column
              key={column.id}
              column={column}
              cards={cards}
            />
          );
        })}
      </div>
      <DragOverlay>
        {activeCard ? (
          <Card card={activeCard} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;
