import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CallService } from '../call.service';
import { UserComponent } from '../user/user.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,HttpClientModule,UserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private http:HttpClient) { }
  @ViewChild('no') reject!:ElementRef;
  @ViewChild('yes') accept!:ElementRef;
  @ViewChild('pending') pending!:ElementRef;
  studentId:string="";

  // For Excel data
  data: any[] = [];
  searchTerm: string = '';
  searchResults: any[] = [];

  ngOnInit() {
    this.loadExcelFile(); // Load the Excel file when the component initializes
  }


  ngAfterViewInit() {

    this.hideall();
    this.loadExcelFile();

  }

  hideall()
  {
    this.reject.nativeElement.classList.add('d-none');
    this.accept.nativeElement.classList.add('d-none');
    this.pending.nativeElement.classList.add('d-none');
  }

  rejected()
  {
    this.reject.nativeElement.classList.remove('d-none');
    this.accept.nativeElement.classList.add('d-none');
    this.pending.nativeElement.classList.add('d-none');
  }
  accepted()
  {
    this.reject.nativeElement.classList.add('d-none');
    this.accept.nativeElement.classList.remove('d-none');
    this.pending.nativeElement.classList.add('d-none');
  }

  pended()
  {
    this.reject.nativeElement.classList.add('d-none');
    this.accept.nativeElement.classList.add('d-none');
    this.pending.nativeElement.classList.remove('d-none');
  }

  loadExcelFile() {
    this.http.get('./assets/data.xlsx', { responseType: 'arraybuffer' }).subscribe(
      data => {
        try {
          // Read the workbook from the array buffer
          const wb: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
          console.log("Workbook:", wb); // Log the workbook to check its contents
          
          // Get the first sheet name and data
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          console.log("Worksheet:", ws); // Log the worksheet to check its contents
  
          // Convert the sheet to JSON
          this.data = XLSX.utils.sheet_to_json(ws);
          console.log("Parsed Data:", this.data); // Log the parsed data
        } catch (error) {
          console.error("Error processing Excel file:", error);
        }
      },
      error => {
        console.error("Error loading Excel file:", error);
      }
    );
  }
  
  
  // Method to search in the Excel data
  searchInExcel() {
    this.searchResults = this.data.filter((row: any) => {
      return Object.values(row).some(value =>
        String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }



}
