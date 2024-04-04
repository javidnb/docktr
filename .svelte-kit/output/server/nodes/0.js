import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.D7dVDd6x.js","_app/immutable/chunks/session.Cr9ded5K.js","_app/immutable/chunks/entry.DMqr0mu4.js","_app/immutable/chunks/scheduler.CtbWrGNo.js","_app/immutable/chunks/index.1Wti0CeJ.js"];
export const stylesheets = ["_app/immutable/assets/0.D-7e8lwo.css"];
export const fonts = [];
