export interface App {
  name: string;
  icon: string;
  description: string;
  links: {
    appleStore?: string;
    fdroid?: string;
    flathub?: string;
    github?: string;
    googlePlay?: string;
    microsoftStore?: string;
    matrix?: string;
    snapcraft?: string;
    web?: string;
  };
}

export const apps: App[] = [
  {
    name: 'Interstellar',
    icon: 'https://raw.githubusercontent.com/jwr1/interstellar/6d8fce0972febccec91fa056746fdb9f4f960217/assets/icons/logo.png',
    description: 'An app for Mbin and Lemmy, connecting you to the fediverse.',
    links: {
      flathub: 'https://flathub.org/apps/one.jwr.interstellar',
      github: 'https://github.com/jwr1/interstellar',
      googlePlay:
        'https://play.google.com/store/apps/details?id=one.jwr.interstellar',
      matrix: 'https://matrix.to/#/#interstellar-space:matrix.org',
    },
  },
];
