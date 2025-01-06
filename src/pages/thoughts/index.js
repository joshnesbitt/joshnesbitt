export const prerender = false;

export async function get({ params, redirect }) {
  return redirect('/', 302);
}
