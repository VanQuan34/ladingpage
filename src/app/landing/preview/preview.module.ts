import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MoWbComponentsModule } from '../../components/components.module';
import { MoWbPipeModule } from '../../pipe/pipe.module';
import { MoLandingPreviewComponent } from './preview.component';
import { MoLandingPreviewPageComponent } from './toolbar/page/page.component';
import { MoLandingPreviewDevicesComponent } from './toolbar/devices/devices.component';
import { MoLandingPreviewToolbarComponent } from './toolbar/toolbar.component';
import { MoLandingPreviewIframeComponent } from './iframe/iframe.component';
import { MoLandingPreviewDragComponent } from './drag/drag.component';

@NgModule({
    imports: [
      CommonModule,
      TranslateModule.forChild({}),
      MoWbComponentsModule,
      MoWbPipeModule
    ],
    exports: [
      MoLandingPreviewComponent
    ],
    declarations: [
      MoLandingPreviewComponent,
      MoLandingPreviewPageComponent,
      MoLandingPreviewDevicesComponent,
      MoLandingPreviewToolbarComponent,
      MoLandingPreviewIframeComponent,
      MoLandingPreviewDragComponent
    ],
    providers: [
    ]
})
export class MoWbPreviewModule {

}
