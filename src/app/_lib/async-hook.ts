import type { UiError } from './ui-error';

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error' };

export interface AsyncHook<T> {
  loading(): boolean;
  error?: UiError;
  state: AsyncState<T>;
}
