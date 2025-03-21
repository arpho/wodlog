import { Component, Input, OnInit } from '@angular/core';
import { PrModel } from 'src/app/models/Pr';

@Component({
  selector: 'app-pr-graph',
  templateUrl: './pr-graph.component.html',
  styleUrls: ['./pr-graph.component.scss'],
  standalone: true,
})
export class PrGraphComponent  implements OnInit {

  constructor() { }
  @Input({required:true}) prList: PrModel[] = []
  @Input({required:true}) unity: string = ' Kg '

  ngOnInit() {
    console.log("pr list", this.prList)
    console.log("unity", this.unity)
  }

}
