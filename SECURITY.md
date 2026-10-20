# Security policy

MacMove is an early developer trial and has not had an independent security audit. It is not designed as a hardened boundary for hostile files. Use files from sources you trust, keep backups, and review important outputs.

## Supported release

Security fixes, if made, are targeted at the latest published release. Older releases do not have a separate support commitment. The current trial targets macOS 26 or later on Apple silicon.

## Security and privacy notes

- File conversion runs locally. The app does not upload files to a MacMove server.
- Update checks contact the public GitHub releases API; they do not send file contents, file names, or account credentials.
- Diagnostic logging is off by default. Setting `MACMOVE_DEBUG=1` enables local logs that can contain file names, full paths, operation details, and errors.
- Setting `MACMOVE_DEBUG_DRAG` enables a local drag trace. It may contain dragged file paths and event details, and is written to the path in the variable or `/tmp/macmove-drag.log`.
- Some media operations can invoke a separately installed FFmpeg executable. FFmpeg is not bundled with MacMove.
- Existing destination files are protected during staged conversions. Native image input has size and pixel limits. Archive conversion is disabled.

These measures do not make parsing untrusted files safe. The app does not yet isolate every worker or enforce hard CPU, memory, time, and output limits. Metadata and visible redaction tools are not certified security or anonymization controls. File extensions are not a trust boundary.

## Report a vulnerability

Please report suspected vulnerabilities privately rather than posting exploit details in a public issue. Use GitHub's private vulnerability reporting form if it is available for this repository, or email [sintaxerror.pvt.ltd@gmail.com](mailto:sintaxerror.pvt.ltd@gmail.com).

Include the MacMove version, macOS version, affected feature, impact, and steps to reproduce. Do not attach private files, personal data, passwords, or secrets. Ask before sending a proof-of-concept file; a minimal synthetic example is preferable.

There is no guaranteed response or remediation timeline. Please allow time for investigation and coordinated disclosure before publishing technical details. Security reports are for vulnerabilities, not general support requests or feature ideas.

