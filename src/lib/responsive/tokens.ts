import { InjectionToken } from '@angular/core';

export const LY_MEDIA_QUERIES = new InjectionToken<LyMediaQueries>('ly·media·queries');

export interface LyMediaQueries { [key: string]: string; }
