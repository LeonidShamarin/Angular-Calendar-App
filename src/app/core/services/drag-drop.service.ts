import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Injectable({ providedIn: 'root' })
export class DragDropService {
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // Переміщення в межах одного дня
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Переміщення між днями
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}