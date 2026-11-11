// Web worker of the Lattice page: runs the live Z_N link ensemble (lattice_mc.js, class LiveRun) off the main thread.
// Messages in: {type: 'config', N, L, kappa}, {type: 'restart', start}, {type: 'run', on}. Messages out: one frame per batch.
import { LiveRun } from './lattice_mc.js';
const run = new LiveRun((m, transfer) => self.postMessage(m, transfer));
self.onmessage = (e) => run.handle(e.data);
self.postMessage({ type: 'ready' });
