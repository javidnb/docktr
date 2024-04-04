import { c as create_ssr_component, d as add_attribute } from "../../../chunks/ssr.js";
import "firebase/app";
import "firebase/auth";
import "../../../chunks/client.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let email = "";
  let password = "";
  return `<div class="register-form"><form><h2 data-svelte-h="svelte-1n16lnh">Qeydiyyat</h2> <input type="text" placeholder="Email"${add_attribute("value", email, 0)}> <input type="password" placeholder="Şifrə"${add_attribute("value", password, 0)}> <button type="submit" data-svelte-h="svelte-e0qoqs">Qeydiyyat</button></form></div>`;
});
export {
  Page as default
};
