/** Shape of one line in the telemetry terminal. */

export type TelemetryAction =
  | 'BOOT' // session started
  | 'SYS' // theme and other system changes
  | 'NAV' // stage switches, Back/Forward
  | 'FILTER' // domain filter
  | 'INSPECT' // project inspector opened/closed
  | 'CMD' // what the visitor typed
  | 'OUT' // a command's output
  | 'DISPATCH' // an outgoing link was opened
  | 'ERR'; // something was refused

export interface TelemetryEvent {
  id: number;
  /** Seconds since the session started, zero-padded: "004.2". */
  elapsedSec: string;
  action: TelemetryAction;
  message: string;
}

export function formatElapsed(seconds: number): string {
  return seconds.toFixed(1).padStart(5, '0');
}
