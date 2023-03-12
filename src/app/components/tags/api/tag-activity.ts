
import { ITagsUpdate } from "./tag-update";

export interface ITagActivity {
    isLoading?: boolean;
    data: Array<ITagsUpdate>
}