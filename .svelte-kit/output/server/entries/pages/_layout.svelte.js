import { c as create_ssr_component } from "../../chunks/ssr.js";
import { w as writable } from "../../chunks/index.js";
import "../../chunks/client.js";
import "firebase/auth";
import "firebase/app";
const session = writable();
const css = {
  code: ".nav.svelte-sk74h3.svelte-sk74h3{display:flex;background:#a1c398;color:white;justify-content:space-between;font-family:math;padding-inline:2rem;align-items:center;border-radius:20px;box-shadow:1px 1px 2px 2px #00000017}.nav.svelte-sk74h3 .navContent.svelte-sk74h3{display:flex;font-size:1.15rem}.nav.svelte-sk74h3 a.svelte-sk74h3{color:#fefded;text-decoration:none;padding:1rem}.nav.svelte-sk74h3 a.svelte-sk74h3:hover{background-color:rgba(0, 0, 0, 0.432)}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let loading = true;
  let loggedIn = false;
  session.subscribe((cur) => {
    loading = cur?.loading;
    loggedIn = cur?.loggedIn;
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<div class="nav svelte-sk74h3"><div class="brand" data-svelte-h="svelte-e55hrb"><h3>Docktr</h3></div> <div class="navContent svelte-sk74h3"><a href="./" class="svelte-sk74h3" data-svelte-h="svelte-1e0w6gx">Ana Səhifə</a> ${!loggedIn ? `<a href="login" class="svelte-sk74h3" data-svelte-h="svelte-phyn4m">İstifadəçi girişi</a>` : `<a href="./profile" class="svelte-sk74h3" data-svelte-h="svelte-tdxnyr">Hesabım</a> <a href="./" class="svelte-sk74h3" data-svelte-h="svelte-545o7n">Çıxış</a>`}</div></div> ${loading ? `<div data-svelte-h="svelte-v3zdfi">Yüklənir...</div>` : `<div>${slots.default ? slots.default({}) : ``}</div>`}`;
});
export {
  Layout as default
};
