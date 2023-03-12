import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MoWbLoginComponent } from "./components/login/login.component";
import { MoWbLogoutComponent } from './components/logout/logout.component';
// import { MoPopupBuilderListPopupComponent } from './popup/list-popup/list-popup.component';
// import { MoLandiPagesEditorComponent } from './landipages/edtior/editor.component';

import { MoLandingEditorComponent } from './landing/editor/editor.component';

export const routes: Routes = [
  {
    path: "login",
    component: MoWbLoginComponent,
  },
  {
    path: "",
    component: MoLandingEditorComponent, // MoPopupBuilderListPopupComponent,
  },
  {
    path: "logout",
    component: MoWbLogoutComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: AppCustomPreload,
      useHash: false,
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
