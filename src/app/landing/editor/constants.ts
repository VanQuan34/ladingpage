class EditorConstants {
  // Events
  public static readonly COMP_SELECTED_UPDATED_EVENT: string = 'comp:selectedUpdated';
  public static readonly COMP_TOGGLED_EVENT: string = 'component:toggled';
  public static readonly COMP_MOVE_STATED_EVENT :string = 'comp:moveStarted';
  public static readonly COMP_MOVE_ENDED_EVENT : string ='comp:moveEnded';
  public static readonly CANVAS_SCROLL_EVENT : string ='canvas:scroll';
  public static readonly CANVAS_RESIZE_STARTED_EVENT : string = 'canvas:resizeStarted';
  public static readonly CANVAS_RESIZE_ENDED_EVENT : string = 'canvas:resizeEnded';
  public static readonly COMP_RESIZE_STARTED_EVENT : string = 'comp:resizeStarted';
  public static readonly COMP_RESIZE_ENDED_EVENT : string = 'comp:resizeEnded';
  public static readonly COMP_UNDO_EVENT : string = 'comp:undo';
  public static readonly COMP_REDO_EVENT : string = 'comp:redo';
  public static readonly COMP_NONE_SELECTED_EVENT : string = 'comp:none-selected';
  public static readonly COMP_NEAREST_SHOW_EVENT: string = 'comp:nearestShow';
  public static readonly COMP_CONTAINER_SHOW_EVENT: string = 'show-container';
  public static readonly COMP_GRID_UPDATE_POS_EVENT: string = 'grid-update-pos';
  public static readonly COMP_GRID_REPLACE_CONTAINER_EVENT: string = 'grid-replace-container';
  public static readonly COMP_MOVING_EVENT: string ='comp:moving';
  public static readonly COMP_SHOW_ATTACH_EVENT: string ='show-attach-container';
  public static readonly COMP_HIDE_ATTACH_EVENT: string ='hide-attach-container';
  public static readonly COMP_HIDE_HOVER_EVENT: string ='comp:hideHover';
  public static readonly COMP_SHOW_HOVER_EVENT: string ='comp:showHover';
  public static readonly COMP_DOCKING_CHANGED_EVENT: string = 'comp:dockingChanged';
  public static readonly GRID_LAYOUT_CHANGED_EVENT: string = 'gridLayout:changed';
  public static readonly COMP_PADDING_CHANGED_EVENT: string = 'comp:paddingChanged';
  public static readonly SELECTED_PAGE_CHANGED_EVENT: string = 'change-selected-page';
  public static readonly SELECTED_COMP_REMOVED_EVENT: string = 'comp:removed';
  public static readonly SELECTED_COMP_MOUSE_DOWN_EVENT: string = 'comp:mousedown';

  // LANG PAGE
  public static readonly LANDING_PAGE_INFO: string = 'landing-page-info';
  public static readonly OPEN_ADD_NEW_ELEMENT_EVENT: string = 'open-addNewElement';
  public static readonly PAGE_INFO_CHANGED_EVENT: string = 'PAGE_INFO_CHANGED';
  public static readonly BREAK_POINTS_PAGE_CHANGED_EVENT: string = 'BREAK_POINTS_PAGE_CHANGED_EVENT';
  public static readonly BREAK_POINT_SELECTED_CHANGED_EVENT: string = 'BREAK_POINT_SELECTED_CHANGED';
  public static readonly IFRAME_WIDTH_CHANGED_EVENT: string = 'IFRAME_WIDTH_CHANGED_EVENT';
  public static readonly BREAK_POINTS_CHANGED_EVENT: string = 'BREAK_POINTS_CHANGED_EVENT';
  public static readonly OPEN_PAGE_MANAGER_EVENT: string = 'OPEN_PAGE_MANAGER_EVENT';
}

export {
  EditorConstants
}