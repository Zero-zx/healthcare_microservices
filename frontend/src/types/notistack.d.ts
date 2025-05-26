declare module 'notistack' {
  import { SnackbarProps } from '@mui/material/Snackbar';
  import { AlertProps } from '@mui/material/Alert';

  export interface OptionsObject {
    variant?: 'default' | 'error' | 'success' | 'warning' | 'info';
    autoHideDuration?: number;
    anchorOrigin?: {
      vertical: 'top' | 'bottom';
      horizontal: 'left' | 'center' | 'right';
    };
    onClose?: () => void;
    action?: React.ReactNode;
    content?: React.ReactNode;
    persist?: boolean;
    preventDuplicate?: boolean;
    style?: React.CSSProperties;
    className?: string;
    SnackbarProps?: Partial<SnackbarProps>;
    AlertProps?: Partial<AlertProps>;
  }

  export interface ProviderContext {
    enqueueSnackbar: (message: string | React.ReactNode, options?: OptionsObject) => string | number;
    closeSnackbar: (key?: string | number) => void;
  }

  export const useSnackbar: () => ProviderContext;

  export const SnackbarProvider: React.ComponentType<{
    children: React.ReactNode;
    maxSnack?: number;
    preventDuplicate?: boolean;
    dense?: boolean;
    iconVariant?: Record<string, React.ReactNode>;
    hideIconVariant?: boolean;
    anchorOrigin?: OptionsObject['anchorOrigin'];
    classes?: Record<string, string>;
    style?: React.CSSProperties;
    className?: string;
  }>;
} 