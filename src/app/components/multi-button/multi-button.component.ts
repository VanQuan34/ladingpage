import { Component, OnInit, Output, EventEmitter } from "@angular/core";

interface IButtonInfo {
  id: number;
  name: string;
  initClass: string;
  selected: boolean;
}
@Component({
  selector: "mo-wb-multi-button",
  templateUrl: "./multi-button.component.html",
  styleUrls: ["./multi-button.component.scss"],
})
export class MoWbMultiButtonComponent implements OnInit {
  listBtn: any;
  initShow: boolean;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.listBtn = [
      {
        id: 1,
        name: 'i18n_general_form',
        initClass: "btn btn-left ",
        selected: false,
      },
      {
        id: 2,
        name: 'i18n_my_form',
        initClass: "btn btn-center ",
        selected: true,
      },
      {
        id: 3,
        name: 'i18n_add_from_file',
        initClass: "btn btn-right",
        selected: false,
      },
    ];
  }

  ngAfterContentInit() {
    let activeBtn = this.listBtn.filter((btn: any) => btn.selected);

    if (activeBtn.length === 0) {
      this.click(this.listBtn[0]);
    }
  }

  click(item: IButtonInfo) {
    this.onClick.emit(item);
    this.listBtn.forEach((btn: any) => (btn.selected = false));
    item.selected = true;
  }
}
