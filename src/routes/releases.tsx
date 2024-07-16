import { For } from 'solid-js';
import releasesJson from '../../.output/data/releases.json';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import Markdown from '~/components/Markdown';
import SimpleIconsGithub from '~icons/simple-icons/github';
import { useSearchParams } from '@solidjs/router';

const releases = releasesJson as Release[];

export interface Release {
  version: string;
  publishedAt: string;
  githubUrl: string;
  body: string;
}

export default function ReleasesPage() {
  const [searchParams] = useSearchParams();

  return (
    <main class="mx-auto p-4 max-w-screen-xl">
      <h1 class="max-6-xs text-6xl text-sky-600 font-extralight uppercase my-16">
        Mbin Releases
      </h1>

      <div class="mb-12 font-light">
        Also view releases on{' '}
        <a href="https://github.com/MbinOrg/mbin/releases" class="text-sky-600">
          GitHub
        </a>
        .
      </div>

      <Accordion
        multiple
        defaultValue={[searchParams.version ?? releases[0].version]}
      >
        <For each={releases}>
          {(release) => (
            <AccordionItem value={release.version}>
              <AccordionTrigger class="text-lg">
                <span class="inline-flex items-center gap-3">
                  {release.version}
                  <span class="text-base font-light">
                    {new Date(release.publishedAt).toLocaleDateString()}
                  </span>
                  <a href={release.githubUrl} class="hover:text-blue-500">
                    <SimpleIconsGithub />
                  </a>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Markdown>{release.body}</Markdown>
              </AccordionContent>
            </AccordionItem>
          )}
        </For>
      </Accordion>
    </main>
  );
}
