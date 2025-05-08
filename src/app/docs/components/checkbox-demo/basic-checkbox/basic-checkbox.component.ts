import { Component, ChangeDetectionStrategy } from '@angular/core';

export interface Task {
  name: string;
  completed: boolean;
  color: string;
  subtasks?: Task[];
}

@Component({
  selector: 'aui-basic-checkbox',
  templateUrl: './basic-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BasicCheckboxComponent {
  task: Task = {
    name: 'Indeterminate',
    completed: true,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: true, color: 'primary'},
      {name: 'Accent', completed: true, color: 'accent'},
      {name: 'Warn', completed: true, color: 'warn'},
    ],
  };

  allComplete = true;
  someComplete = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    this._updateIndeterminate();
  }

  private _updateIndeterminate() {
    if (this.task.subtasks == null) {
      this.someComplete = false;
    } else {
      this.someComplete = !this.allComplete && this.task.subtasks.some(t => t.completed);
    }

  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
    this._updateIndeterminate();
  }
}
