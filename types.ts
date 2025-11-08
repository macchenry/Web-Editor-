
export interface Project {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  externalResources: string[];
}

export type LogType = 'log' | 'error' | 'warn';

export interface LogEntry {
  type: LogType;
  message: string;
  timestamp: string;
}

export type EditorType = 'html' | 'css' | 'js';

export type LayoutType = 'horizontal' | 'vertical';
