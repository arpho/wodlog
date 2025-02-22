import { IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';
import { PaginationOptions } from './../../models/paginationOptions';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon
  ]
})
export class PaginatorComponent implements OnInit {
@Input({required:true})  PaginationOptions:PaginationOptions =  {
  page:0,
  limit:10,
  total:0
}
  constructor() { }

  prevPage() {
    console.log("prev page")
    this.PaginationOptions.page = this.PaginationOptions.page - 1
    console.log("prev page",this.PaginationOptions)
  }

  nextPage() {
    console.log("next page")
    this.PaginationOptions.page = this.PaginationOptions.page + 1
    console.log("next page",this.PaginationOptions)
  }
  ngOnInit() {
    console.log("init paginator",this.PaginationOptions)
  }

}
