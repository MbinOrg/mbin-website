import { Button } from '~/components/ui/button';

export default function Home() {
  return (
    <main class="text-center mx-auto p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-extralight uppercase my-10">
        Mbin
      </h1>
      <p class="my-10 text-2xl text-gray-400 block mx-auto">
        a federated content aggregator, voting, discussion and microblogging
        platform
        <br />
        (By the community, for the community)
      </p>
      <Button href="/servers" as="a">
        Join a Server
      </Button>
    </main>
  );
}
