# Third-party software and attributions

MacMove includes upstream code and uses macOS system frameworks. Each component keeps its own copyright and license notices. This file is an attribution guide; it does not replace the license files.

## Satsuma

- Source: [plyght/Satsuma](https://github.com/plyght/satsuma)
- Imported revision: `6cb76b78e1932bcdb297be73454ed75d09c252cc`
- Copyright: © 2026 plyght
- License: MIT; the full upstream license text is in [`NativeApp/LICENSE`](NativeApp/LICENSE).

The native application is substantially based on Satsuma's Swift implementation. Oasis-authored changes include MacMove branding, build and test scripts, drag workflows, file actions and checksums, safer output publication, input limits, opt-in diagnostics, bounded process output, and archive restrictions. No upstream image or logo assets were imported.

Oasis-authored MacMove additions are identified as GPL-3.0-only in [`LICENSE`](LICENSE). Satsuma-derived source retains its upstream MIT copyright and notice. Read both license files when using or redistributing code from this repository.

## Apple frameworks and operating-system tools

AppKit, SwiftUI, ImageIO, PDFKit, AVFoundation, CoreImage, CryptoKit, and related APIs are supplied by macOS and are not redistributed separately. System utilities used by the app are part of macOS, not bundled third-party executables.

## Optional external software

Some audio, video, and codec operations can use FFmpeg if the user has installed it. MacMove does not bundle FFmpeg. FFmpeg's license and codec terms depend on the particular build; users are responsible for obtaining it from a source they trust and reviewing its notices.

## Interaction-design reference

[DragShift](https://github.com/llamaboi55/DragShift) was reviewed as an interaction-design reference. Its radial-menu motion and completion controls informed design exploration for MacMove 0.1.8. No DragShift source code or artwork was imported, and it is not a runtime dependency. This acknowledgement does not imply affiliation or endorsement.

