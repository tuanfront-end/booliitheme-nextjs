// While a template is still being built, the Switch puts its knobs inside this
// panel rather than drawing a panel of its own: it renders into the element
// carrying this id and registers here. Registering locks Color and Preset until
// the harvest, because the Switch is still deciding what Original is, and the
// values it writes inline would win over anything those two rows set.
//
// Nothing registers in a finished template, so none of this runs.
export const BUILD_SLOT = "preset-panel-build";

let count = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export function registerBuild() {
  count += 1;
  emit();
  return () => {
    count -= 1;
    emit();
  };
}

export function subscribeBuild(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const building = () => count > 0;
