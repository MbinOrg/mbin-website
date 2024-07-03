import { useLocation } from '@solidjs/router';

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? 'border-sky-600'
      : 'border-transparent hover:border-sky-600';
  return (
    <nav class="flex px-4 py-2 items-center bg-[#29144a]">
      <a href="/">
        <img src="/logo.svg" class="size-8" />
      </a>
      <ul class="container flex items-center p-3 text-gray-200">
        <li class={`border-b-2 ${active('/')} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        <li class={`border-b-2 ${active('/servers')} mx-1.5 sm:mx-6`}>
          <a href="/servers">Servers</a>
        </li>
        <span class="grow"></span>
        <li class={`border-b-2 mx-1.5 sm:mx-6`}>
          <a href="https://docs.joinmbin.org/">Docs</a>
        </li>
        <li class={`border-b-2 mx-1.5 sm:mx-6`}>
          <a href="https://github.com/mbinOrg/mbin">GitHub</a>
        </li>
      </ul>
    </nav>
  );
}
