import { useState } from 'react';
import {
  KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

/** Centralizes drag state and ensures drag overlays are cleaned up on every exit. */
export function useKanbanDrag(onMove: (activeId: string, overId: string) => void) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 7 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const onDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));
  const onDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (event.over) onMove(String(event.active.id), String(event.over.id));
  };
  const onDragCancel = () => setActiveId(null);
  return { activeId, sensors, onDragStart, onDragEnd, onDragCancel };
}
