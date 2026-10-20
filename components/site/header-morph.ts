"use client";

import { createContext } from "react";

// Defaults to on, so the header morphs with nothing above it — which is every
// page once the switch is down, and every page that never mounted it. A
// context that defaulted to off would ship a header that quietly stopped
// morphing the moment the scaffolding went.
export const HeaderMorph = createContext(true);
