export enum InvertMediaQuery {
  No,
  Yes
}

export function transformMediaQuery(media: string, invertMediaQuery: InvertMediaQuery = InvertMediaQuery.No): string | string[] {
  if (media && invertMediaQuery === InvertMediaQuery.Yes) {
    const newVal = media.split(',').map(_ => `not ${_}`);
    return newVal;
  }
  return media;
}
