let faultInjector: (() => void) | null = null;

export function runSyncRouteFaultInjector() {
  faultInjector?.();
}

export function setSyncRouteFaultInjectorForTests(injector: (() => void) | null) {
  faultInjector = injector;
}
