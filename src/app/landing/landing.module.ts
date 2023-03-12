import { MoButtonService } from './../api/buttonApi';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { MoWbComponentsModule } from '../components/components.module';
import { MoWbPipeModule } from '../pipe/pipe.module';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { MoWbPreviewModule } from '../landing/preview/preview.module';


// components
import { MoLandingEditorComponent } from './editor/editor.component';
import { MoLandingEditorDragScreenComponent } from './editor/drag-screen/drag_screen.component';
import { MoLandingEditorInspectorComponent } from './editor/inspector/inspector.component';
import { MoLandingEditorInspectorAlignComponent } from './editor/inspector/layout/align/align.component';
import { MoLandingEditorInspectorSizeComponent } from './editor/inspector/layout/size/size.component';
import { MoLandingEditorInspectorRepeaterComponent } from './editor/inspector/layout/comp/repeater/repeater.component';
import { MoLandingEditorInspectorGalleryComponent } from './editor/inspector/layout/comp/gallery/gallery.component';
import { MoLandingEditorInspectorCarouselComponent } from './editor/inspector/layout/comp/carousel/carousel.component';
import { MoLandingEditorInspectorListOfCarouselComponent } from './editor/inspector/layout/comp/carousel/list/list.component';
import { MoLandingEditorInspectorListControllerComponent } from './editor/inspector/layout/comp/list/list.component';
import { MoLandingEditorInspectorMenuOfListControlComponent } from './editor/inspector/layout/comp/list/menu/menu.component';
import { MoLandingEditorInspectorListOfGalleryComponent } from './editor/inspector/layout/comp/gallery/list/list.component';
import { MoLandingEditorInspectorAttributesGalleryComponent } from './editor/inspector/layout/comp/gallery/attributes/attributes.component';
import { MoLandingEditorInspectorAddVideoComponent } from './editor/inspector/layout/comp/gallery/attributes/form/form.component';
import { MoLandingEditorInspectorSubMenuOfListComponent } from './editor/inspector/layout/comp/list/menu/sub-menu/sub-menu.component';
import { MoLandingEditorInspectorElementCardRepeatComponent } from './editor/inspector/layout/comp/repeater/element/card/card.component';
import { MoLandingEditorInspectorElementSlideRepeatComponent } from './editor/inspector/layout/comp/repeater/element/slide/slide.component';
import { MoLandingEditorInspectorElementCellRepeatComponent } from './editor/inspector/layout/comp/repeater/element/cell/cell.component';
import { MoLandingEditorInspectorPositionComponent } from './editor/inspector/layout/position/position.component';
import { MoLandingEditorInspectorAdjustComponent } from './editor/inspector/layout/adjust/adjust.component';
import { MoLandingEditorInspectorAnchorComponent } from './editor/inspector/layout/anchor/anchor.component';
import { MoLandingEditorInspectorLayoutComponent } from './editor/inspector/layout/layout.component';
import { MoLandingEditorInspectorBreadcrumbComponent } from './editor/inspector/breadcrumb/breadcrumb.component';
import { MoLandingEditorInspectorBaseComponent } from './editor/inspector/base.component';
import { MoLandingEditorToolbarComponent } from './editor/toolbar/toolbar.component';
import { MoLandingEditorToolbarDeviceComponent } from './editor/toolbar/center/device/device.component';
import { MoLandingEditorToolbarDeviceMenuComponent  } from './editor/toolbar/center/device/menu/menu.component';
import { MoLandingEditorInspectorLayoutItemComponent } from './editor/inspector/layout/layout/layout.component';
import { MoLandingEditorInspectorLayoutMenuComponent } from './editor/inspector/layout/layout/menu/menu.component';
import { MoLandingEditorInspectorMenuIconComponent } from './editor/inspector/layout/layout/menu/icon/icon.component';
import { MoLandingEditorMenuComponent } from './editor/toolbar/left/menu/menu.component';
import { MoLandingEditorMenuQuickAddComponent } from './editor/toolbar/left/menu/quick-add/quick-add.component';

import { MoLandingEditorSiteStylesComponent } from './editor/toolbar/left/site-styles/site-styles.component';
import { MoLandingEditorSiteStylesColorComponent } from './editor/toolbar/left/site-styles/color/color.component';
import { MoLandingEditorSiteStylesTextComponent } from './editor/toolbar/left/site-styles/text/text.component';
import { MoLandingEditorSiteStylesTextEditComponent } from './editor/toolbar/left/site-styles/text/edit/edit.component';

// page
import { MoLandingEditorInspectorPageComponent } from './editor/inspector/page/page.component';

// inspector design
import { MoLandingEditorInspectorDesignComponent } from './editor/inspector/design/design.component';
import { MoLandingEditorInspectorDesignCompsTextComponent } from './editor/inspector/design/comps/text/text.component';
import { MoLandingEditorInspectorDesignCompsButtonComponent } from './editor/inspector/design/comps/button/button.component';
import { MoLandingEditorInspectorDesignElementsTextComponent } from './editor/inspector/design/elements/text/text.component';
import { MoLandingEditorInspectorDesignElementsBackgroundComponent } from './editor/inspector/design/elements/background/background.component';
import { MoLandingEditorInspectorLayoutCompsRepeaterComponent } from './editor/inspector/design/comps/repeater/repeater.component';
import { MoLandingEditorInspectorLayoutCompsGalleryComponent } from './editor/inspector/design/comps/gallery/gallery.component';
import { MoLandingEditorInspectorLayoutCompsTabsComponent } from './editor/inspector/design/comps/tabs/tabs.component';
import { MoLandingEditorInspectorLayoutCompsAccordionComponent } from './editor/inspector/design/comps/accordion/accordion.component';
import { MoLandingEditorInspectorListOfTabsComponent } from './editor/inspector/layout/comp/tabs/list/list.component';
import { MoLandingEditorInspectorDesignCompsRepeaterItemComponent } from './editor/inspector/design/comps/repeater/item/repeater_item.component';
import { MoLandingEditorInspectorPositionPaddingComponent } from './editor/inspector/layout/position/padding/padding.component';
import { MoLandingEditorInspectorDesignElementsBorderComponent } from './editor/inspector/design/elements/border/border.component';
import { MoLandingEditorInspectorDesignElementsBorderRadiusComponent } from './editor/inspector/design/elements/border-radius/border_radius.component';
import { MoLandingEditorInspectorDesignElementsShadowComponent } from './editor/inspector/design/elements/shadow/shadow.component';
import { MoLandingEditorInspectorDesignElementsPaddingComponent } from './editor/inspector/design/elements/padding/padding.component';
import { MoLandingEditorInspectorDesignCompsSectionComponent } from './editor/inspector/design/comps/section/section.component';
import { MoLandingEditorInspectorDesignCompsFooterComponent } from './editor/inspector/design/comps/footer/footer.component';
import { MoLandingEditorInspectorDesignCompsHeaderComponent } from './editor/inspector/design/comps/header/header.component';
import { MoLandingEditorInspectorDesignCompsMenuComponent } from './editor/inspector/design/comps/menu/menu.component';
import { MoLandingEditorInspectorDesignCompsContainerComponent } from './editor/inspector/design/comps/container/container.component';
import { MoLandingEditorInspectorDesignElementsPaddingFullComponent } from './editor/inspector/design/elements/padding/full/full.component';
import { MoLandingEditorInspectorDesignCompsMenuItemComponent } from './editor/inspector/design/comps/menu/item/item.component';

// layer
import { MoLandingEditorLayerSelectedComponent } from './editor/layer/selected/selected.component';
import { MoLandingEditorLayerBaseComponent } from './editor/layer/base.component';
import { MoLandingEditorLayerResizeComponent } from './editor/layer/resize/resize.component';
import { MoLandingEditorLayerSelectedContainerComponent } from './editor/layer/selected/container/container.component';
import { MoLandingEditorLayerDockComponent } from './editor/layer/dock/dock.component';
import { MoLandingEditorLayerGridLayoutComponent } from './editor/layer/grid-layout/grid_layout.component';
import { MoLandingEditorLayerNearestLineComponent } from './editor/layer/nearest-line/nearest_line.component';
import { MoLandingEditorLayerHoverComponent } from './editor/layer/hover/hover.component';
import { MoLandingEditorLayerPaddingComponent } from './editor/layer/padding/padding.component';
import { MoLandingEditorLayerToolbarSectionComponent } from './editor/layer/toolbar/section/section.component';
import { MoLandingEditorLayerToolbarRowColComponent } from './editor/layer/toolbar/row-col/row_col.component';
import { MoLandingEditorLayerToolbarBreadcrumbComponent } from './editor/layer/toolbar/breadcrumb/breadcrumb.component';
import { MoLandingEditorLayerToolbarFooterComponent } from './editor/layer/toolbar/footer/footer.component';
import { MoLandingEditorLayerToolbarHeaderComponent } from './editor/layer/toolbar/header/header.component';
import { MoLandingEditorLayerToolbarMoreActionComponent } from './editor/layer/toolbar/more-action/more_action.component';
import { MoLandingEditorLayerToolbarContainerComponent } from './editor/layer/toolbar/container/container.component';

// toolbar
import { MoLandingEditorLayerToolbarComponent } from  './editor/layer/toolbar/toolbar.component';
import { MoLandingEditorLayerToolbarButtonComponent } from './editor/layer/toolbar/button/button.component';
import { MoLandingEditorPageListComponent } from './editor/toolbar/center/page-list/page_list.component';


// popup
import { MoLandingEditorPopupButtonSettingComponent } from './editor/popup/button/setting/setting.component';
import { MoLandingEditorPopupAnimationComponent } from './editor/popup/animation/animation.component';
import { MoLandingEditorPopupLinkComponent } from './editor/popup/link/link.component';
import { MoLandingEditorPopupActionComponent } from './editor/popup/action/action.component';

// services
import { MoBlocksService } from './editor/blocks/blocks.service';
import { MoRootManagerService } from './editor/root.service';
import { MoFontApiService } from '../api/fontApi';
import { MoLandingEditorInspectorElementListRepeatComponent } from './editor/inspector/layout/comp/repeater/element/list/list.component';
import { MoWbClickOutsideModule } from '../directives/click-outside.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MoLandingEditorLayerToolbarRepeaterComponent } from './editor/layer/toolbar/repeater/repeater.component';
import { MoMediaStoreModule } from '../media-store/media-store.module';

import { MoTagsServices } from '../api/tagsApi';
import { MoWbMenuPageDropdownComponent } from '../components/menu-dropdown/menu-page/menu-page.component';
import { MoLandingEditorCompPopupLinkPageComponent } from './editor/popup/link/page/page.component';
import { MoLandingEditorCompPopupMenuSettingComponent } from './editor/popup/menu/setting/setting.component';
import { MoLandingEditorCompPopupLinkPhoneComponent } from './editor/popup/link/phone/phone.component';
import { MoLandingEditorCompPopupLinkFileComponent } from './editor/popup/link/file/file.component';
import { MoLandingEditorCompPopupLayoutComponent } from './editor/popup/layout/layout.component';
import { MoLandingEditorCompPopupLinkJumpTopBotComponent } from './editor/popup/link/jump-top-bot/jump-top-bot.component';
import { MoLandingEditorCompPopupLinkEmailComponent } from './editor/popup/link/email/email.component';
import { MoLandingEditorCompPopupEventComponent } from './editor/popup/event/event.component';
import { MoLandingEditorCompPopupLinkCancelLinkComponent } from './editor/popup/link/none/none.component';
import { MoLandingEditorCompPopupLinkWebComponent } from './editor/popup/link/web/web.component';
import { MoLandingEditorCompToolbarMenuComponent } from './editor/layer/toolbar/menu/menu.component';
import { MoLandingEditorCompPopupManagerMenuComponent } from './editor/popup/menu/manager-menu/manager-menu.component';
import { MoLandingEditorCompPopupAddItemMenuComponent } from './editor/popup/menu/add-item-menu/add-item-menu.component';
import { MoLandingEditorLayerToolbarFormComponent } from './editor/layer/toolbar/form/form.component';
import { MoLandingEditorPopupFormSettingComponent } from './editor/popup/form/form.component';
import { MoLandingEditorLayerToolbarFormFieldButtonComponent } from './editor/layer/toolbar/form/field-button/field-button.component';
import { MoLandingEditorDropdownMenuCompComponent } from '../components/dropdown-menu-comp/page_list.component';
import { MoLandingEditorInspectorLayoutAddGridCustomComponent } from './editor/inspector/layout/layout/add-grid-custom/grid-custom.component';
import { MoLandingEditorInspectorDesignCompsFormComponent } from './editor/inspector/design/comps/form/form.component';
import { MoLandingEditorInspectorDesignCompsFormInputComponent } from './editor/inspector/design/comps/form/input/input.component';
import { MoLandingEditorInspectorDesignCompsCarouselComponent } from './editor/inspector/design/comps/carousel/carousel.component';
import { MoLandingEditorInspectorAttributesCarouselComponent } from './editor/inspector/layout/comp/carousel/attributes/attributes.component';
import { MoLandingEditorInspectorChangeNameItemRepeater } from './editor/inspector/layout/comp/list/menu/item/item.component';
import { MoLandingEditorInspectorTabsComponent } from './editor/inspector/layout/comp/tabs/tabs.component';

import { MoLandingEditorPageComponent } from './editor/toolbar/left/page/page.component';
import { MoLandingEditorPageSettingComponent } from './editor/toolbar/left/page/setting/setting.component';
import { MoLandingEditorPageInfoComponent } from './editor/toolbar/left/page/info/info.component';
import { MoLandingEditorPageSeoComponent } from './editor/toolbar/left/page/seo/seo.component';
import { MoLandingEditorInspectorLayoutCompsTabsContentComponent } from './editor/inspector/design/comps/tabs/content/content.component';
import { MoLandingEditorInspectorEditTabsComponent } from './editor/inspector/layout/comp/tabs/edit/edit.component';
import { MoLandingEditorInspectorDesignElementsMarginComponent } from './editor/inspector/design/elements/margin/margin.component';
import { MoLandingEditorInspectorAccordionComponent } from './editor/inspector/layout/comp/accordion/accordion.component';
import { MoLandingEditorInspectorRemoveTabsComponent } from './editor/inspector/layout/comp/tabs/remove/remove.component';
import { MoLandingEditorInspectorEditAccordionComponent } from './editor/inspector/layout/comp/accordion/edit/edit.component';
import { MoLandingEditorInspectorLayoutCompsAccordionContentComponent } from './editor/inspector/design/comps/accordion/content/content.component';
import { MoLandingEditorLayerToolbarTableComponent } from './editor/layer/toolbar/table/table.component';
 
@NgModule({
  imports: [
    CommonModule,
    MoWbComponentsModule,
    MoWbPipeModule,
    MoWbClickOutsideModule,
    DragDropModule,
    MoMediaStoreModule,
    DragulaModule,
    MoWbPreviewModule,
    TranslateModule.forChild({}),
  ],
  declarations: [
    MoLandingEditorComponent,
    MoLandingEditorDragScreenComponent,
    MoLandingEditorInspectorComponent,
    MoLandingEditorInspectorAlignComponent,
    MoLandingEditorInspectorSizeComponent,
    MoLandingEditorInspectorRepeaterComponent,
    MoLandingEditorInspectorTabsComponent,
    MoLandingEditorInspectorGalleryComponent,
    MoLandingEditorInspectorCarouselComponent,
    MoLandingEditorInspectorAccordionComponent,
    MoLandingEditorInspectorListControllerComponent,
    MoLandingEditorInspectorListOfTabsComponent,
    MoLandingEditorInspectorMenuOfListControlComponent,
    MoLandingEditorInspectorListOfGalleryComponent,
    MoLandingEditorInspectorListOfCarouselComponent,
    MoLandingEditorInspectorAttributesGalleryComponent,
    MoLandingEditorInspectorAttributesCarouselComponent,
    MoLandingEditorInspectorAddVideoComponent,
    MoLandingEditorInspectorSubMenuOfListComponent,
    MoLandingEditorInspectorChangeNameItemRepeater,
    MoLandingEditorInspectorElementCardRepeatComponent,
    MoLandingEditorInspectorElementListRepeatComponent,
    MoLandingEditorInspectorElementSlideRepeatComponent,
    MoLandingEditorInspectorElementCellRepeatComponent,
    MoLandingEditorInspectorPositionComponent,
    MoLandingEditorInspectorAdjustComponent,
    MoLandingEditorInspectorAnchorComponent,
    MoLandingEditorInspectorLayoutComponent,
    MoLandingEditorInspectorBreadcrumbComponent,
    MoLandingEditorInspectorBaseComponent,
    MoLandingEditorToolbarComponent,
    MoLandingEditorToolbarDeviceComponent,
    MoLandingEditorToolbarDeviceMenuComponent,
    MoLandingEditorInspectorLayoutItemComponent,
    MoLandingEditorInspectorLayoutMenuComponent,
    MoLandingEditorInspectorMenuIconComponent,
    MoLandingEditorMenuComponent,
    MoLandingEditorMenuQuickAddComponent,
    MoLandingEditorSiteStylesComponent,
    MoLandingEditorSiteStylesColorComponent,
    MoLandingEditorSiteStylesTextComponent,
    MoLandingEditorSiteStylesTextEditComponent,
    MoWbMenuPageDropdownComponent,

    // design inspector
    MoLandingEditorInspectorDesignComponent,
    MoLandingEditorInspectorDesignCompsTextComponent,
    MoLandingEditorInspectorDesignCompsMenuComponent,
    MoLandingEditorInspectorDesignElementsTextComponent,
    MoLandingEditorInspectorDesignCompsFormComponent,
    
    MoLandingEditorInspectorDesignCompsFormInputComponent,
    MoLandingEditorInspectorDesignCompsButtonComponent,
    MoLandingEditorInspectorDesignElementsTextComponent,
    MoLandingEditorInspectorDesignElementsBackgroundComponent,
    MoLandingEditorInspectorLayoutCompsRepeaterComponent,
    MoLandingEditorInspectorLayoutCompsGalleryComponent,
    MoLandingEditorInspectorLayoutCompsTabsComponent,
    MoLandingEditorInspectorLayoutCompsTabsContentComponent,
    MoLandingEditorInspectorLayoutCompsAccordionComponent,
    MoLandingEditorInspectorLayoutCompsAccordionContentComponent,
    MoLandingEditorInspectorDesignCompsRepeaterItemComponent,
    MoLandingEditorInspectorDesignCompsCarouselComponent,
    MoLandingEditorInspectorPositionPaddingComponent,
    MoLandingEditorInspectorDesignElementsBorderComponent,
    MoLandingEditorInspectorDesignElementsBorderRadiusComponent,
    MoLandingEditorInspectorDesignElementsShadowComponent,
    MoLandingEditorInspectorDesignElementsPaddingComponent,
    MoLandingEditorInspectorDesignElementsMarginComponent,
    MoLandingEditorInspectorDesignCompsSectionComponent,
    MoLandingEditorInspectorDesignCompsFooterComponent,
    MoLandingEditorInspectorDesignCompsHeaderComponent,
    MoLandingEditorInspectorPageComponent,
    MoLandingEditorInspectorDesignCompsMenuComponent,
    MoLandingEditorInspectorDesignCompsContainerComponent,
    MoLandingEditorInspectorDesignElementsPaddingFullComponent,
    MoLandingEditorInspectorDesignCompsMenuItemComponent,
    
    // layer
    MoLandingEditorLayerSelectedComponent,
    MoLandingEditorLayerBaseComponent,
    MoLandingEditorLayerResizeComponent,
    MoLandingEditorLayerSelectedContainerComponent,
    MoLandingEditorLayerDockComponent,
    MoLandingEditorLayerNearestLineComponent,
    MoLandingEditorLayerHoverComponent,
    MoLandingEditorLayerPaddingComponent,
    MoLandingEditorLayerToolbarSectionComponent,
    MoLandingEditorLayerToolbarRowColComponent,
    MoLandingEditorLayerToolbarBreadcrumbComponent,
    MoLandingEditorLayerToolbarFooterComponent,
    MoLandingEditorLayerToolbarHeaderComponent,
    MoLandingEditorLayerToolbarMoreActionComponent,
    MoLandingEditorLayerToolbarContainerComponent,

    // grid layout
    MoLandingEditorLayerGridLayoutComponent,
    MoLandingEditorInspectorLayoutAddGridCustomComponent,

    // popup
    MoLandingEditorPopupButtonSettingComponent,
    MoLandingEditorPopupAnimationComponent,
    MoLandingEditorPopupLinkComponent,
    MoLandingEditorPopupActionComponent,
    MoLandingEditorCompPopupMenuSettingComponent,
    MoLandingEditorCompPopupLinkPhoneComponent,
    MoLandingEditorCompPopupLinkFileComponent,
    MoLandingEditorCompPopupLayoutComponent,
    MoLandingEditorCompPopupLinkJumpTopBotComponent,
    MoLandingEditorCompPopupLinkWebComponent,
    MoLandingEditorCompPopupLinkEmailComponent,
    MoLandingEditorCompPopupEventComponent,
    MoLandingEditorCompPopupLinkCancelLinkComponent,
    MoLandingEditorCompPopupLinkPageComponent,
    MoLandingEditorCompPopupManagerMenuComponent,
    MoLandingEditorCompPopupAddItemMenuComponent,
    MoLandingEditorPopupFormSettingComponent,
    MoLandingEditorInspectorEditTabsComponent,
    MoLandingEditorInspectorRemoveTabsComponent,
    MoLandingEditorInspectorEditAccordionComponent,

    // toolbar
    MoLandingEditorCompToolbarMenuComponent,
    MoLandingEditorPopupButtonSettingComponent,
    MoLandingEditorPopupAnimationComponent,
    MoLandingEditorPopupLinkComponent,
    MoLandingEditorPopupActionComponent,
    MoLandingEditorLayerToolbarComponent,
    MoLandingEditorLayerToolbarFormComponent,
    MoLandingEditorLayerToolbarFormFieldButtonComponent,
    MoLandingEditorLayerToolbarButtonComponent,
    MoLandingEditorLayerToolbarRepeaterComponent,
    MoLandingEditorLayerToolbarTableComponent,
    MoLandingEditorPageListComponent,
    MoLandingEditorDropdownMenuCompComponent,
    
    MoLandingEditorPageComponent,
    MoLandingEditorPageSettingComponent,
    MoLandingEditorPageInfoComponent,
    MoLandingEditorPageSeoComponent
  ],

  providers: [
    MoBlocksService,
    MoRootManagerService,
    MoFontApiService,
    MoButtonService,
    MoTagsServices,
    DragulaService,
  ],
  
  exports: [
    MoLandingEditorComponent
  ]
})
export class MoWbLandingPageModule { }
