export class AlyleServiceConfig {
  primary: string;
  accent: string;
  other: string;
  colorScheme?: string;
  typography?: {
    fontFamily: string;
    fontSize: number;
  };
  schemes?: {
    light: {
      colorText?: string;
      disabled?: string;
      bgText?: string;
      main?: string;
      [key: string]: {
        [key: string]: any
      } | any;
    },
    dark: {
      colorText?: string;
      disabled?: string;
      bgText?: string;
      main?: string;
      [key: string]: {
        [key: string]: any
      } | any;
    }
  };
  shade?: string;
  palette?: {
    [key: string]: {
      [key: string]: {[key: string]: string} | any;
      contrast?: string;
    }
  };

}
