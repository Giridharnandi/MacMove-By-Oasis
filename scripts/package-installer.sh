#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

unsigned="${UNSIGNED_INSTALLER:-0}"
if [[ "$unsigned" != "1" ]]; then
  : "${DEVELOPER_ID_APPLICATION:?Set this to the Developer ID Application identity in your keychain.}"
  : "${DEVELOPER_ID_INSTALLER:?Set this to the Developer ID Installer identity in your keychain.}"
  : "${NOTARY_PROFILE:?Set this to a notarytool keychain profile.}"
fi

./scripts/build-app.sh

app="$PWD/dist/MacMove.app"
version=$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$app/Contents/Info.plist")
package="$PWD/dist/MacMove-$version-macOS.pkg"
temporary="$PWD/dist/MacMove-$version-unsigned.pkg"

rm -f "$temporary" "$package"
pkgbuild \
  --component "$app" \
  --install-location /Applications \
  --identifier com.oasis.macmove \
  --version "$version" \
  "$temporary"
if [[ "$unsigned" == "1" ]]; then
  mv "$temporary" "$package"
else
  productsign --sign "$DEVELOPER_ID_INSTALLER" "$temporary" "$package"
  rm -f "$temporary"
  xcrun notarytool submit "$package" --keychain-profile "$NOTARY_PROFILE" --wait
  xcrun stapler staple "$package"
  spctl --assess --type install --verbose=4 "$package"
fi
shasum -a 256 "$package" > "$package.sha256"

if [[ "$unsigned" == "1" ]]; then
  printf 'Built unsigned installer: %s\n' "$package"
else
  printf 'Built notarized installer: %s\n' "$package"
fi
