import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"

@Component({
  selector: 'mo-wb-components-tags-item',
  templateUrl: 'item.component.html',
  styleUrls: ['./item.component.scss']
})


export class MoLibTagsItemComponent implements OnInit{

  @Input() item: any;
  @Output() removeItem: EventEmitter<string> = new EventEmitter<string>();

  constructor(){

  }

  ngOnInit(): void {
  }

  handlerOnRemove(e: any, name: string){
    e.stopPropagation();
    this.removeItem.emit(name);
  }
}

