import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Card from './Card';

function Column({ column, cards }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="column">
      <div className="column-header">
        <span className="column-title">
          {column.title}
          <span className="column-count">{cards.length}</span>
        </span>
      </div>
      <div className="column-content" ref={setNodeRef}>
        <SortableContext
          items={cards.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.length === 0 ? (
            <div className="column-empty">No tasks yet</div>
          ) : (
            cards.map((card) => (
              <Card key={card.id} card={card} columnId={column.id} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export default Column;
