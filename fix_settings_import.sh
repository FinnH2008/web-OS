#!/bin/bash
# Remove inline import
sed -i '/import { useNotificationStore } from/d' src/apps/SettingsApp.tsx
# Add to top again if missing
if ! grep -q "import { useNotificationStore }" src/apps/SettingsApp.tsx; then
    sed -i '3iimport { useNotificationStore } from "@/store/notificationStore";' src/apps/SettingsApp.tsx
fi
