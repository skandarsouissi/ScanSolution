import { Component, OnInit } from '@angular/core';
import { Table, TableService } from './table.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  tables: Table[] = [];
  tableForm: FormGroup;

  constructor(private tableService: TableService, private fb: FormBuilder) {
    this.tableForm = this.fb.group({
      code: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables() {
    this.tableService.getAllTables().subscribe(t => this.tables = t);
  }

  createTable() {
    if (this.tableForm.valid) {
      const newTable: Table = { code: this.tableForm.value.code };
      this.tableService.createTable(newTable).subscribe(t => {
        this.tables.push(t);
        this.tableForm.reset();
      });
    }
  }

  deleteTable(id: number) {
    this.tableService.deleteTable(id).subscribe(() => {
      this.tables = this.tables.filter(t => t.id !== id);
    });
  }

}
