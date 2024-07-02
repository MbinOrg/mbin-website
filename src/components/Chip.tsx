import { ParentComponent, Show } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

const Chip: ParentComponent<{ icon?: string; title?: string }> = (props) => {
  return (
    <span
      class="p-1 m-1 border rounded-lg inline-flex items-center"
      title={props.title}
    >
      <Show when={props.icon}>
        <Icon icon={props.icon!} class="pr-1" />
      </Show>
      {props.children}
    </span>
  );
};

export default Chip;
