import { Injectable } from "@angular/core";

@Injectable()
export class ShareDataService {
   private bodyTemplate: string;
   private popupId: string;
   private popupTemplate: any;
   private title: string;

   public setContent(content: any): void {
      this.bodyTemplate = content;
   }

   public readContent(): string {
      return this.bodyTemplate;
   }

   public setPopupId(id: string): void {
      this.popupId = id;
   }

   public getPopupId(): string {
      return this.popupId;
   }

   public setPopupTemplate(template: object): void {
      this.popupTemplate = template;
   }

   public getPopupTemplate() {
      return this.popupTemplate;
   }

   public setTitle(title: string) {
      this.title = title;
   }

   public getTitle() {
      return this.title;
   }

}
