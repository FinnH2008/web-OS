#!/bin/bash
sed -i 's/<TopMenuBar \/>/<TopMenuBar \/>\n            <NotificationToast \/>/g' src/components/desktop/Desktop.tsx
sed -i 's/import TopMenuBar from '\''\.\/menubar\/TopMenuBar'\'';/import TopMenuBar from '\''\.\/menubar\/TopMenuBar'\'';\nimport NotificationToast from '\''\.\.\/ui\/NotificationToast'\'';/' src/components/desktop/Desktop.tsx
