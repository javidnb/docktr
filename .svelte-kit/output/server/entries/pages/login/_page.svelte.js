import { c as create_ssr_component, d as add_attribute } from "../../../chunks/ssr.js";
import "firebase/app";
import "firebase/auth";
import "../../../chunks/client.js";
const css = {
  code: ".login-form.svelte-1b0xwiv.svelte-1b0xwiv{display:grid;place-content:center}.login-form.svelte-1b0xwiv div.svelte-1b0xwiv{background-color:#ececec;border-radius:10px;padding:1rem 2rem;margin-top:1rem}.login-form.svelte-1b0xwiv div form.svelte-1b0xwiv{display:flex;flex-direction:column;gap:1rem}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let email = "";
  let password = "";
  $$result.css.add(css);
  return `<div class="login-form svelte-1b0xwiv"><div class="svelte-1b0xwiv"><h1 style="color: #A1C398; font-family: math; text-align: center;" data-svelte-h="svelte-1ixt51c">Giriş</h1> <form class="svelte-1b0xwiv"><input style="padding: .5rem; min-width: 300px" type="text" placeholder="Email"${add_attribute("value", email, 0)}> <input style="padding: .5rem;" type="password" placeholder="Şifrə"${add_attribute("value", password, 0)}> <button type="submit" style="padding: 0.5rem; border-radius: 10px; background: #A1C398; color: white; border: 0px; font-size: 1.05rem; cursor: pointer;" data-svelte-h="svelte-126hmm4">Daxil Ol</button></form> <hr style="margin-top: 1rem"> <button style="margin-block: 0.5rem; padding: 0.4rem; border-radius: 10px; width: 100%; background: #4285f4; color: white; border: 0px;" data-svelte-h="svelte-8ytbms">Google</button> <div style="display: flex; flex-direction: column; gap: .5rem; align-items: center" class="svelte-1b0xwiv" data-svelte-h="svelte-1jh4s49">Hesabınız yoxdur? <a href="/register">Qeydiyyat</a></div></div> </div>`;
});
export {
  Page as default
};
