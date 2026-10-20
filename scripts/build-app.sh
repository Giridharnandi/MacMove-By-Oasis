#!/bin/bash
set -euo pipefail
# MacMove by Oasis native macOS app build.
cd "$(dirname "$0")/.."
app="$PWD/dist/MacMove.app"
mkdir -p "$app/Contents/MacOS" "$PWD/.build/module-cache"
find NativeApp/Sources -name '*.swift' -print0 | xargs -0 xcrun swiftc -swift-version 5 -O -parse-as-library -module-cache-path "$PWD/.build/module-cache" -o "$app/Contents/MacOS/MacMove"
# Use the MacMove bundle identity for app settings and login registration.
cat > "$app/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>MacMove</string>
<key>CFBundleIdentifier</key><string>com.oasis.macmove</string>
<key>CFBundleName</key><string>MacMove</string>
<key>CFBundleDisplayName</key><string>MacMove by Oasis</string>
<key>CFBundleIconFile</key><string>AppIcon</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleShortVersionString</key><string>0.2.0</string>
<key>CFBundleVersion</key><string>11</string>
<key>LSMinimumSystemVersion</key><string>26.0</string>
<key>LSUIElement</key><true/>
<key>NSHighResolutionCapable</key><true/>
</dict></plist>
PLIST
mkdir -p "$app/Contents/Resources"
cp NativeApp/Resources/OasisLogo.png "$app/Contents/Resources/OasisLogo.png"
cp NativeApp/Resources/OasisLogo.png "$PWD/.build/OasisLogo.png"
xcrun swiftc -module-cache-path "$PWD/.build/module-cache" NativeApp/Sources/UI/BrandArtwork.swift scripts/make-icon.swift -o .build/make-icon
.build/make-icon "$PWD/.build/AppIcon.iconset"
python3 scripts/package-icon.py .build/AppIcon.iconset "$app/Contents/Resources/AppIcon.icns"
cp LICENSE "$app/Contents/Resources/GPL-3.0.txt"
cp NativeApp/LICENSE "$app/Contents/Resources/Satsuma-MIT.txt"
cp THIRD_PARTY_NOTICES.md "$app/Contents/Resources/THIRD_PARTY_NOTICES.md"
# Local builds may be ad-hoc signed. Public installers use Developer ID signing and notarization.
if [[ -n "${DEVELOPER_ID_APPLICATION:-}" ]]; then
  codesign --force --options runtime --timestamp --sign "$DEVELOPER_ID_APPLICATION" "$app"
else
  codesign --force --sign - "$app"
fi
codesign --verify --deep --strict --verbose=2 "$app"
test -x "$app/Contents/MacOS/MacMove"
plutil -lint "$app/Contents/Info.plist"
printf 'Built %s\n' "$app"
