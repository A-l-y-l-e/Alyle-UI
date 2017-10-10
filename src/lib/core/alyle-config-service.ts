export class AlyleServiceConfig {
  primary: string;
  accent: string;
  other: string;
  colorScheme?: string;
  typography?: {
    fontFamily: string,
    fontSize: number
  };
  schemes?: {
    light: {
      colorText?: string,
      disabled?: string,
      bgText?: string,
      main?: string,
      [key: string]: string
    },
    dark: {
      colorText?: string,
      disabled?: string,
      bgText?: string,
      main?: string,
      [key: string]: string
    }
  };
  shade?: string;
  palette?: {
    [key: string]: {
      color?: {
        [key: string]: string
      } | string,
      contrast?: string
    }
  };

}
