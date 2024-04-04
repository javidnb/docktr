

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/register/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DaAGyWsc.js","_app/immutable/chunks/scheduler.CtbWrGNo.js","_app/immutable/chunks/index.1Wti0CeJ.js","_app/immutable/chunks/session.Cr9ded5K.js","_app/immutable/chunks/entry.DMqr0mu4.js"];
export const stylesheets = [];
export const fonts = [];
