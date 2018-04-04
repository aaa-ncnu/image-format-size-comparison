#!/bin/bash
IMAGE_REGEX="(.*/)([^\.]+)\.(jpe?g|png)$"

if [[ "${1}" =~ ${IMAGE_REGEX} ]]; then
  cd ${BASH_REMATCH[1]}
  for WIDTH in 768 1536 1440 2880; do
    if [[ "${BASH_REMATCH[3]}" = "png" ]]; then
      convert "${BASH_REMATCH[2]}.${BASH_REMATCH[3]}" -resize ${WIDTH}x "${BASH_REMATCH[2]}-${WIDTH}w.png"
      cwebp -resize ${WIDTH} 0 -z 6 "${BASH_REMATCH[2]}.${BASH_REMATCH[3]}" -o "${BASH_REMATCH[2]}-${WIDTH}w.webp"
    else
      for QUALITY in 40 50 60 70 80 90 100; do
        convert "${BASH_REMATCH[2]}.${BASH_REMATCH[3]}" -resize ${WIDTH}x -quality ${QUALITY} "${BASH_REMATCH[2]}-${WIDTH}w-${QUALITY}q.jpg"
        cwebp -resize ${WIDTH} 0 -q ${QUALITY} "${BASH_REMATCH[2]}.${BASH_REMATCH[3]}" -o "${BASH_REMATCH[2]}-${WIDTH}w-${QUALITY}q.webp"
      done
    fi
  done
fi
