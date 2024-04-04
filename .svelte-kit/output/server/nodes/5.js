

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/register/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.B7DPXz8O.js","_app/immutable/chunks/scheduler.CtbWrGNo.js","_app/immutable/chunks/index.1Wti0CeJ.js","_app/immutable/chunks/session.BXjiYFpz.js","_app/immutable/chunks/entry.BVVyiokN.js"];
export const stylesheets = [];
export const fonts = [];
