// In-page links into the newsroom's YouTube player (NewsroomWatch, inside the
// "Videos" tab of NewsroomBoard). Any section on the page can open a video:
// the URL gets a shareable hash (#video-<youtubeId>, or #videos for the tab)
// and an event tells the board to switch tabs, load the video and scroll to it.

export const VIDEO_HASH_PREFIX = '#video-'
export const VIDEOS_TAB_HASH = '#videos'
export const WATCH_EVENT = 'newsroom:watch'

export type WatchRequest = { id?: string; play: boolean }

export function videoHash(youtubeId: string) {
  return `${VIDEO_HASH_PREFIX}${youtubeId}`
}

/** Reads #video-<id> / #videos. Returns null for any other hash. */
export function parseVideoHash(hash: string): { id?: string } | null {
  if (hash === VIDEOS_TAB_HASH) return {}
  if (hash.startsWith(VIDEO_HASH_PREFIX)) {
    const id = hash.slice(VIDEO_HASH_PREFIX.length)
    return id ? { id } : {}
  }
  return null
}

/** Opens the Videos tab and, when an id is given, plays that video. */
export function openNewsroomVideo(youtubeId?: string) {
  const hash = youtubeId ? videoHash(youtubeId) : VIDEOS_TAB_HASH
  // pushState keeps the browser from jumping to a non-existent anchor and does
  // not fire hashchange, so the event below is the single trigger.
  if (window.location.hash !== hash) window.history.pushState(null, '', hash)
  window.dispatchEvent(new CustomEvent<WatchRequest>(WATCH_EVENT, { detail: { id: youtubeId, play: Boolean(youtubeId) } }))
}

/** YouTube-style relative age ("1 month ago", "4 years ago") from an ISO date. */
export function timeAgo(iso: string, now: number = Date.now()) {
  const seconds = Math.max(0, (now - new Date(iso).getTime()) / 1000)
  const units: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]
  for (const [size, label] of units) {
    const n = Math.floor(seconds / size)
    if (n >= 1) return `${n} ${label}${n === 1 ? '' : 's'} ago`
  }
  return 'just now'
}

/** Privacy-enhanced embed URL for the in-page player. */
export function youtubeEmbedUrl(youtubeId: string, autoplay: boolean) {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`
}
