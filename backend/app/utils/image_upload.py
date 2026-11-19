"""Shared validation and settings for image uploads.

Every endpoint that sends a user-supplied image to Cloudinary should call
``validate_image_upload`` first, so oversized or non-image files are
rejected with a clear message instead of failing inside Cloudinary.
"""

import os
from typing import BinaryIO

from fastapi import HTTPException, UploadFile, status


ALLOWED_IMAGE_CONTENT_TYPES = frozenset(
    {
        "image/jpeg",
        "image/png",
        "image/webp",
    }
)

MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024

# Longest side Cloudinary will store. Images are only ever scaled down
# ("limit" crop), never up. Keep these in sync with the frontend values in
# frontend/src/lib/image.ts.
LISTING_IMAGE_MAX_DIMENSION = 2048
PROFILE_IMAGE_MAX_DIMENSION = 800

UNSUPPORTED_IMAGE_TYPE_MESSAGE = (
    "Please upload a JPG, PNG or WebP image."
)
IMAGE_TOO_LARGE_MESSAGE = (
    "Image is too large. The maximum size is 10 MB."
)
IMAGE_UPLOAD_FAILED_MESSAGE = (
    "Failed to upload image. Please try again."
)


def get_upload_size(file: UploadFile) -> int:
    """Return the upload size in bytes without reading it into memory."""
    if file.size is not None:
        return file.size

    stream = file.file
    position = stream.tell()

    try:
        stream.seek(0, os.SEEK_END)
        return stream.tell()
    finally:
        stream.seek(position)


def _has_allowed_image_signature(stream: BinaryIO) -> bool:
    """Check the file's first bytes, since the content type is client-supplied."""
    position = stream.tell()

    try:
        stream.seek(0)
        header = stream.read(12)
    finally:
        stream.seek(position)

    is_jpeg = header.startswith(b"\xff\xd8\xff")
    is_png = header.startswith(b"\x89PNG\r\n\x1a\n")
    is_webp = header[:4] == b"RIFF" and header[8:12] == b"WEBP"

    return is_jpeg or is_png or is_webp


def validate_image_upload(file: UploadFile) -> None:
    """Raise 415 for unsupported files and 413 for files over the size limit."""
    if file.content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=UNSUPPORTED_IMAGE_TYPE_MESSAGE,
        )

    if get_upload_size(file) > MAX_IMAGE_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=IMAGE_TOO_LARGE_MESSAGE,
        )

    if not _has_allowed_image_signature(file.file):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=UNSUPPORTED_IMAGE_TYPE_MESSAGE,
        )


def size_limit_transformation(max_dimension: int) -> list[dict]:
    """Cloudinary incoming transformation: shrink to fit, never enlarge."""
    return [
        {
            "width": max_dimension,
            "height": max_dimension,
            "crop": "limit",
            "quality": "auto",
        }
    ]
