import remarkGfm from 'remark-gfm';
import { ParentComponent } from 'solid-js';
import { SolidMarkdown } from 'solid-markdown';

const MarkdownInner: ParentComponent = (props) => {
  return (
    <SolidMarkdown class="text-left markdown" remarkPlugins={[remarkGfm]}>
      {props.children as string}
    </SolidMarkdown>
  );
};

export default MarkdownInner;
