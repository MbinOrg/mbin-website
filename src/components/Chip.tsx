import { ComponentProps, JSX, ParentComponent, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

const Chip: ParentComponent<{
  icon?: (props: ComponentProps<'svg'>) => JSX.Element;
  title?: string;
  class?: string;
  classList?: {
    [k: string]: boolean | undefined;
  };
}> = (props) => {
  return (
    <span
      class={
        'px-2 py-1 border rounded-lg inline-flex items-center ' + props.class
      }
      classList={props.classList}
      title={props.title}
    >
      <Show when={props.icon}>
        <Dynamic component={props.icon} class="pr-1" />
      </Show>
      {props.children}
    </span>
  );
};

export default Chip;
