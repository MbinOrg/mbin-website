import { For, Show, createSignal } from 'solid-js';
import Markdown from '~/components/Markdown';
import Chip from '~/components/Chip';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import serversJson from '../../.output/data/servers.json';

const servers = serversJson as Server[];

export interface Server {
  domain: string;
  version: string;
  name: string;
  description: string;
  openRegistrations: boolean;
  federationEnabled: boolean;
  language: string;
  contactEmail: string;
  totalUsers: number;
  activeHalfyearUsers: number;
  activeMonthUsers: number;
  localPosts: number;
  localComments: number;
  pages: {
    about?: string;
    contact?: string;
    faq?: string;
    privacyPolicy?: string;
    terms?: string;
  };
  defederated: string[];
}

const pageNames: Required<Server['pages']> = {
  about: 'About',
  contact: 'Contact',
  faq: 'Frequently Asked Questions',
  privacyPolicy: 'Privacy Policy',
  terms: 'Terms of Service',
};

const languageNames = new Intl.DisplayNames(['en'], {
  type: 'language',
});

export default function ServersPage() {
  const [filterRegistration, setFilterRegistration] = createSignal(true);
  const [langFilter, setLangFilter] = createSignal<string>('');

  const resultServers = () => {
    return servers.filter(
      (server) =>
        (!filterRegistration() || server.openRegistrations) &&
        (!langFilter() || server.language == langFilter()),
    );
  };

  return (
    <main class="text-center mx-auto text-gray-700 p-4 max-w-screen-xl">
      <h1 class="max-6-xs text-6xl text-sky-600 font-extralight uppercase my-16">
        Mbin Servers
      </h1>
      Open Registration Only:{' '}
      <input
        type="checkbox"
        checked={filterRegistration()}
        onChange={(e) => setFilterRegistration(e.target.checked)}
      />
      <br />
      Language:
      <select onChange={(e) => setLangFilter(e.target.value)}>
        <option value="">All Languages</option>
        <For each={[...new Set(servers.map((v) => v.language))]}>
          {(lang) => <option value={lang}>{languageNames.of(lang)}</option>}
        </For>
      </select>
      <div
        class="grid"
        style={{
          'grid-template-columns': 'repeat(auto-fit, minmax(350px, 1fr))',
        }}
      >
        <For each={resultServers()}>
          {(server) => {
            const StatChips = () => (
              <>
                <Chip>Version {server.version}</Chip>
                <Chip title="Language" icon="material-symbols:language">
                  {languageNames.of(server.language)}
                </Chip>
                <Chip title="Total users" icon="material-symbols:person">
                  {server.totalUsers}
                </Chip>
                <Chip title="Active users" icon="material-symbols:person-check">
                  {server.activeMonthUsers}
                  <span class="opacity-75">/month</span>
                </Chip>
              </>
            );

            return (
              <div class="border rounded-lg p-4 m-4 text-white block relative">
                <a
                  class="text-3xl text-sky-600 block text-center"
                  href={`https://${server.domain}`}
                >
                  <img
                    src={`https://${server.domain}/favicon.ico`}
                    class="inline-block size-16"
                  />
                  <br />
                  {server.domain}
                </a>

                <Show when={server.name != '' && server.name != server.domain}>
                  <div class="text-2xl text-sky-600 font-light">
                    {server.name}
                  </div>
                </Show>

                <p>{server.description}</p>

                <StatChips />

                <Dialog>
                  <DialogTrigger
                    as={Button<'button'>}
                    variant="outline"
                    class="my-1 w-full"
                  >
                    More info
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-screen-xl max-h-[95%] overflow-scroll">
                    <DialogHeader>
                      <DialogTitle>{server.domain}</DialogTitle>
                      <DialogDescription>
                        {server.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div>
                      <StatChips />
                      <Chip
                        title="Active users"
                        icon="material-symbols:person-check"
                      >
                        {server.activeHalfyearUsers}
                        <span class="opacity-75">/halfyear</span>
                      </Chip>
                      <Chip title="Local posts" icon="material-symbols:news">
                        {server.localPosts}
                      </Chip>
                      <Chip
                        title="Local comments"
                        icon="material-symbols:comment"
                      >
                        {server.localComments}
                      </Chip>
                    </div>

                    <Accordion
                      multiple={false}
                      collapsible
                      defaultValue={['about']}
                    >
                      <For each={Object.entries(server.pages)}>
                        {([page, pageContent]) => (
                          <Show when={pageContent || page === 'contact'}>
                            <AccordionItem value={page}>
                              <AccordionTrigger>
                                {pageNames[page as keyof Server['pages']]}
                              </AccordionTrigger>
                              <AccordionContent>
                                <Show when={page == 'contact'}>
                                  <Button
                                    href={`mailto:${server.contactEmail}`}
                                    as="a"
                                  >
                                    Email admin: {server.contactEmail}
                                  </Button>
                                </Show>
                                <Markdown>{pageContent}</Markdown>
                              </AccordionContent>
                            </AccordionItem>
                          </Show>
                        )}
                      </For>
                      <Show when={server.defederated.length}>
                        <AccordionItem value="defederated">
                          <AccordionTrigger>
                            Defederated Servers ({server.defederated.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <For each={server.defederated}>
                              {(server) => <Chip>{server}</Chip>}
                            </For>
                          </AccordionContent>
                        </AccordionItem>
                      </Show>
                    </Accordion>

                    <Show when={server.openRegistrations}>
                      <DialogFooter>
                        <Button
                          href={`https://${server.domain}/register`}
                          as="a"
                        >
                          Join
                        </Button>
                      </DialogFooter>
                    </Show>
                  </DialogContent>
                </Dialog>
                <Show when={server.openRegistrations}>
                  <Button
                    href={`https://${server.domain}/register`}
                    as="a"
                    variant="default"
                    class="my-1 w-full"
                  >
                    Join
                  </Button>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
    </main>
  );
}
