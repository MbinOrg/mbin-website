import { ParentComponent } from 'solid-js';
import { SolidMarkdown } from 'solid-markdown';

const MarkdownInner: ParentComponent = (props) => {
  return (
    <SolidMarkdown class="text-left markdown">{props.children}</SolidMarkdown>
  );
};

export default MarkdownInner;
