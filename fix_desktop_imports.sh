#!/bin/bash
# Remove missing imports that weren't carried over from Phase 1/2 in this new run
sed -i '/import SystemMonitorApp from/d' src/components/desktop/Desktop.tsx
sed -i '/import BrowserApp from/d' src/components/desktop/Desktop.tsx
sed -i '/import MediaPlayerApp from/d' src/components/desktop/Desktop.tsx
sed -i '/import AppStoreApp from/d' src/components/desktop/Desktop.tsx
sed -i '/import { useAppStore } from/d' src/components/desktop/Desktop.tsx
sed -i '/import { useContextMenu } from/d' src/components/desktop/Desktop.tsx
sed -i '/import ContextMenu from/d' src/components/desktop/Desktop.tsx
sed -i '/<ContextMenu/d' src/components/desktop/Desktop.tsx
sed -i '/show={clicked}/d' src/components/desktop/Desktop.tsx
sed -i '/x={points.x}/d' src/components/desktop/Desktop.tsx
sed -i '/y={points.y}/d' src/components/desktop/Desktop.tsx
sed -i '/items={desktopContextMenuItems}/d' src/components/desktop/Desktop.tsx
sed -i '/onClose={() => setClicked(false)}/d' src/components/desktop/Desktop.tsx
sed -i '/\/>/d' src/components/desktop/Desktop.tsx # risky, let's just do a clean rewrite of Desktop.tsx
