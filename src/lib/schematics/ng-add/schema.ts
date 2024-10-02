import {Schema as ComponentSchema} from '@schematics/angular/component/schema';
export interface Schema extends ComponentSchema {
  project: string;
  gestures: boolean;
  themes: string[];
}
