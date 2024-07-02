import { Button } from '~/components/ui/button';

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Mbin
      </h1>
      <Button href="/servers" as="a">
        Join a Server
      </Button>
    </main>
  );
}
