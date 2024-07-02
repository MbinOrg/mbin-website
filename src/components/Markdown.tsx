import { clientOnly } from '@solidjs/start';
import { ParentComponent } from 'solid-js';

const ClientOnlyComp = clientOnly(() => import('./MarkdownInner'));

const Markdown: ParentComponent = (props) => {
  return <ClientOnlyComp>{props.children}</ClientOnlyComp>;
};

export default Markdown;
