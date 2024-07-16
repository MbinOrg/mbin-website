import { ComponentProps, JSX, ParentComponent, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

const Chip: ParentComponent<{
  icon?: (props: ComponentProps<'svg'>) => JSX.Element;
  title?: string;
  class?: string;
  classList?: {
    [k: string]: boolean | undefined;
  };
  href?: string;
}> = (props) => {
  return (
    <Dynamic
      component={props.href ? 'a' : 'span'}
      class={
        'px-2 py-1 border rounded-lg inline-flex items-center ' + props.class
      }
      classList={{
        'hover:text-blue-500': !!props.href,
        ...props.classList,
      }}
      title={props.title}
      href={props.href}
    >
      <Show when={props.icon}>
        <Dynamic component={props.icon} class="pr-1" />
      </Show>
      {props.children}
    </Dynamic>
  );
};

export default Chip;
