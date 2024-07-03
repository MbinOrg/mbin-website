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
import MaterialSymbolsLanguage from '~icons/material-symbols/language';
import MaterialSymbolsPerson from '~icons/material-symbols/person';
import MaterialSymbolsPersonCheck from '~icons/material-symbols/person-check';
import MaterialSymbolsNews from '~icons/material-symbols/news';
import MaterialSymbolsComment from '~icons/material-symbols/comment';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';

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
  const [sort, setSort] = createSignal<'random' | 'activeUsers' | 'totalUsers'>(
    'activeUsers',
  );
  const sortNameMap = {
    random: 'Random',
    activeUsers: 'Active Users',
    totalUsers: 'Total Users',
  };

  const resultServers = () => {
    return servers
      .filter(
        (server) =>
          (!filterRegistration() || server.openRegistrations) &&
          (!langFilter() || server.language == langFilter()),
      )
      .sort((a, b) => {
        switch (sort()) {
          case 'random':
            return 0.5 - Math.random();
          case 'activeUsers':
            return b.activeMonthUsers - a.activeMonthUsers;
          case 'totalUsers':
            return b.totalUsers - a.totalUsers;
          default:
            return 0;
        }
      });
  };

  return (
    <main class="mx-auto p-4 max-w-screen-xl">
      <h1 class="max-6-xs text-6xl text-sky-600 font-extralight uppercase my-16">
        Mbin Servers
      </h1>
      <div class="flex">
        <Checkbox
          id="open-registration"
          class="mr-2"
          checked={filterRegistration()}
          onChange={(v) => setFilterRegistration(v)}
        />
        <Label for="open-registration-input">Open Registration Only</Label>
      </div>
      <br />
      Language:
      <Select
        value={langFilter()}
        onChange={setLangFilter}
        options={[...new Set(servers.map((v) => v.language))]}
        placeholder="All Languages"
        itemComponent={(props) => (
          <SelectItem item={props.item}>
            {languageNames.of(props.item.rawValue)}
          </SelectItem>
        )}
      >
        <SelectTrigger aria-label="Fruit" class="w-[180px]">
          <SelectValue<string>>
            {(state) => languageNames.of(state.selectedOption())}
          </SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
      <br />
      Sort by:
      <Select
        value={sort()}
        onChange={setSort}
        options={Object.keys(sortNameMap)}
        itemComponent={(props) => (
          <SelectItem item={props.item}>
            {sortNameMap[props.item.rawValue]}
          </SelectItem>
        )}
      >
        <SelectTrigger aria-label="Fruit" class="w-[180px]">
          <SelectValue<string>>
            {(state) => sortNameMap[state.selectedOption()]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
      <div class="my-4 flex flex-wrap gap-3 justify-center text-xl">
        <Chip>{servers.length} servers</Chip>
        <Chip>
          {servers.reduce((v, server) => v + server.totalUsers, 0)} total users
        </Chip>
        <Chip>
          {servers.reduce((v, server) => v + server.activeMonthUsers, 0)} active
          users
        </Chip>
      </div>
      <div
        class="grid gap-4"
        style={{
          'grid-template-columns': 'repeat(auto-fit, minmax(350px, 1fr))',
        }}
      >
        <For each={resultServers()}>
          {(server) => {
            const StatChips = () => (
              <>
                <Chip title="Mbin Version">Mbin {server.version}</Chip>
                <Chip title="Language" icon={MaterialSymbolsLanguage}>
                  {languageNames.of(server.language)}
                </Chip>
                <Chip title="Total users" icon={MaterialSymbolsPerson}>
                  {server.totalUsers}
                </Chip>
                <Chip title="Active users" icon={MaterialSymbolsPersonCheck}>
                  {server.activeMonthUsers}
                  <span class="opacity-75">/month</span>
                </Chip>
              </>
            );

            return (
              <div class="border rounded-lg p-4 block relative">
                <a
                  class="block text-center pb-1"
                  href={`https://${server.domain}`}
                >
                  <img
                    src={`https://${server.domain}/favicon.ico`}
                    class="inline-block size-16"
                  />
                  <br />
                  <div class="text-3xl text-sky-600">{server.domain}</div>
                  <Show
                    when={server.name != '' && server.name != server.domain}
                  >
                    <div class="text-2xl text-sky-600 font-light">
                      {server.name}
                    </div>
                  </Show>
                </a>

                <p class="text-center">{server.description}</p>

                <div class="my-1 flex flex-wrap gap-1">
                  <StatChips />
                </div>

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

                    <div class="flex flex-wrap gap-1">
                      <StatChips />
                      <Chip
                        title="Active users"
                        icon={MaterialSymbolsPersonCheck}
                      >
                        {server.activeHalfyearUsers}
                        <span class="opacity-75">/halfyear</span>
                      </Chip>
                      <Chip title="Local posts" icon={MaterialSymbolsNews}>
                        {server.localPosts}
                      </Chip>
                      <Chip
                        title="Local comments"
                        icon={MaterialSymbolsComment}
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
                            <div class="flex flex-wrap gap-1">
                              <For each={server.defederated}>
                                {(server) => <Chip>{server}</Chip>}
                              </For>
                            </div>
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
