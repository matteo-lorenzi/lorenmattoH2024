import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface FilterConfig {
  field: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

@Component({
  selector: 'app-filter-sort',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, CommonModule],
  templateUrl: './filter-sort.component.html',
  styleUrl: './filter-sort.component.css'
})

export class FilterSortComponent {
  @Input() filterConfig: FilterConfig[] = [];
  @Input() sortableFields: { value: string; label: string; }[] = [];
  
  @Output() filterChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<{field: string; order: 'asc' | 'desc'}>();

  filterValues: { [key: string]: any } = {};
  sortField: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onFilterChange(): void {
    this.filterChange.emit(this.filterValues);
  }

  onSortChange(): void {
    if (this.sortField) {
      this.sortChange.emit({
        field: this.sortField,
        order: this.sortOrder
      });
    }
  }

  resetFilters(): void {
    this.filterValues = {};
    this.sortField = '';
    this.sortOrder = 'asc';
    this.onFilterChange();
    this.onSortChange();
  }
}
