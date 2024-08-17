import { HttpClientModule } from '@angular/common/http';
import { Component, Input, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CallService } from '../call.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule,HttpClientModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @Input() id!:string;
  @Input() email!:string
  @Input() name!:string
  @Input() img!:string
  constructor(){}

}
