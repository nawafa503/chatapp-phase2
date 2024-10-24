import {Channel} from "./channel";

export interface Group {
  id: number;
  name: string;
  channels: Channel[];
}
