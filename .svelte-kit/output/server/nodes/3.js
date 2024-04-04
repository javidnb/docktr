

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/login/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.DzOh1MBo.js","_app/immutable/chunks/scheduler.CtbWrGNo.js","_app/immutable/chunks/index.1Wti0CeJ.js","_app/immutable/chunks/session.BXjiYFpz.js","_app/immutable/chunks/entry.BVVyiokN.js"];
export const stylesheets = ["_app/immutable/assets/3.CBgi2BUR.css"];
export const fonts = [];
