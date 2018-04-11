export class AlyleServiceConfig {
  primary: string;
  accent: string;
  other: string;
  colorScheme?: 'light' | 'dark';
  typography?: {
    fontFamily: string;
    fontSize: number;
  };
  variables?: {
    /** Others */
    [key: string]: {
      [key: string]: any // ...
    } | any
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
  /** Deprecated */
  shade?: string;
  palette?: {
    [key: string]: {
      [key: string]: {[key: string]: string} | any;
      contrast?: string;
    }
  };

}
