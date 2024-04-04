

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.B3DRWYOe.js","_app/immutable/chunks/scheduler.CtbWrGNo.js","_app/immutable/chunks/index.1Wti0CeJ.js"];
export const stylesheets = [];
export const fonts = [];
