#!/bin/bash
cat src/apps/SettingsApp.tsx | grep -n "alert("
sed -i 's/alert("Account settings saved.");/useNotificationStore.getState().addNotification("Account Updated", "Your account settings have been saved successfully.");/' src/apps/SettingsApp.tsx
# adding import at the top
sed -i '3iimport { useNotificationStore } from "@/store/notificationStore";' src/apps/SettingsApp.tsx
