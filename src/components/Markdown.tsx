import remarkGfm from 'remark-gfm';
import { Component } from 'solid-js';
import { SolidMarkdown } from 'solid-markdown';

const Markdown: Component<{ children: string }> = (props) => {
  return (
    <SolidMarkdown class="text-left markdown" remarkPlugins={[remarkGfm]}>
      {props.children}
    </SolidMarkdown>
  );
};

export default Markdown;
