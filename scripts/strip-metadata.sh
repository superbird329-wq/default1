#!/usr/bin/env bash
#
# Strip EXIF, XMP, IPTC, and document metadata from everything in public/.
# Spec §3.3. Run this before committing ANY image or PDF.
#
#   npm run strip-metadata
#
# Camera images carry GPS coordinates. Scanned drawings and exported PDFs carry
# the author name, the originating software, and often the full original file
# path — which can include a client name or a project number. Stripping is not
# optional.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="$ROOT/public"

if ! command -v exiftool >/dev/null 2>&1; then
  cat >&2 <<'MSG'
error: exiftool is not installed.

  macOS          brew install exiftool
  Debian/Ubuntu  sudo apt-get install libimage-exiftool-perl

Do not commit images or PDFs until this has been run.
MSG
  exit 1
fi

if [ ! -d "$TARGET" ]; then
  echo "error: $TARGET does not exist." >&2
  exit 1
fi

echo "Stripping metadata from $TARGET ..."

# -all=            remove every metadata tag
# -overwrite_original  do not leave _original backup copies in the repo
# -r               recurse
exiftool -all= -overwrite_original -r -q -q "$TARGET"

echo
echo "Done. Verifying nothing survived:"
echo

# Anything other than the handful of structural tags below means a file still
# carries metadata. ExifTool always reports File*/Directory/ImageSize etc.,
# which are read off the filesystem rather than stored in the file.
exiftool -r -q -q -s \
  --FileName --Directory --FileSize --FileModifyDate --FileAccessDate \
  --FileInodeChangeDate --FilePermissions --FileType --FileTypeExtension \
  --MIMEType --ImageWidth --ImageHeight --ImageSize --Megapixels \
  --BitDepth --ColorType --Compression --Filter --Interlace \
  --PDFVersion --Linearized --PageCount --Encryption \
  "$TARGET" || true

echo
echo "Review the output above. Any remaining Author, Creator, GPS, Title, or"
echo "Producer tag must be removed before committing."
