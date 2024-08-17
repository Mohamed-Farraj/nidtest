import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserComponent } from '../user/user.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, HttpClientModule, UserComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild('no') reject!: ElementRef;
  @ViewChild('yes') accept!: ElementRef;
  @ViewChild('pending') pending!: ElementRef;

  studentId: string = "";
  studentName: string = "";
  rejectmsg!:string;
  data: any[] = [];
  searchTerm: string = '';
  searchResults: any[] = [];

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Load Excel file only on the client-side
      this.loadExcelFile();
    }
  }

  ngAfterViewInit() {
    this.hideAll();
  }

  hideAll() {
    this.reject.nativeElement.classList.add('d-none');
    this.accept.nativeElement.classList.add('d-none');
    this.pending.nativeElement.classList.add('d-none');
  }

  rejected() {
    this.reject.nativeElement.classList.remove('d-none');
    this.accept.nativeElement.classList.add('d-none');
    this.pending.nativeElement.classList.add('d-none');
  }

  accepted() {
    this.reject.nativeElement.classList.add('d-none');
    this.accept.nativeElement.classList.remove('d-none');
    this.pending.nativeElement.classList.add('d-none');
  }

  pended() {
    this.reject.nativeElement.classList.add('d-none');
    this.accept.nativeElement.classList.add('d-none');
    this.pending.nativeElement.classList.remove('d-none');
  }

  loadExcelFile() {
    this.http.get('assets/data.xlsx', { responseType: 'arraybuffer' }).subscribe(
      data => {
        const wb: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Log in the browser console only
        this.data.shift()
        console.log("Parsed Data (Client):", this.data);
      },
      error => {
        console.error("Error loading Excel file:", error);
      }
    );
  }

  searchInExcel(nid:string) {

    const index = this.findIndexByNid(nid);
    if (index !== -1) {
      console.log(`NID found at index: ${index}`);
      if(this.data[index][2]==="accepted")
      {
        this.studentName = this.data[index][0]
        this.accepted();
      }
      else if(this.data[index][2]==="rejected")
      {
        this.rejectmsg = "تم رفض الطلب";
        this.studentName = this.data[index][0]
        this.rejected();
      }
      else
      {
        this.studentName = this.data[index][0]
        this.pended();        
      }
    } else {
      this.rejectmsg = "هذا الرقم غير مسجل بالنظام";
      this.studentName = ""
      this.rejected();
      console.log('NID not found');
    }

    
  }

  findIndexByNid(nid: string): number {
    return this.data.findIndex(row => row[1] === nid);
  }
}
