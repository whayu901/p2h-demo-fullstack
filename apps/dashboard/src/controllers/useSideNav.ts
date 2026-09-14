import { useState } from 'react';

export interface SideNavController {
  collapsed: boolean;
  toggle: () => void;
}

/** Owns whether the side navigation is collapsed to icon-only width. */
export function useSideNav(): SideNavController {
  const [collapsed, setCollapsed] = useState(false);

  return {
    collapsed,
    toggle: () => setCollapsed((prev) => !prev),
  };
}
