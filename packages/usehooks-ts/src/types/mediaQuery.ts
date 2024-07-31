import type { CustomLength, Length } from './length'

export type MediaQuery =
  | ['any-hover', 'hover' | 'none']
  | ['any-pointer', 'none' | 'coarse' | 'fine']
  | [
      'aspect-ratio' | 'min-aspect-ratio' | 'max-aspect-ratio',
      `${number}/${number}`,
    ]
  | ['color' | 'min-color' | 'max-color', number]
  | ['color-index' | 'min-color-index' | 'max-color-index', number]
  | [
      'display-mode',
      (
        | 'browser'
        | 'fullscreen'
        | 'minimal-ui'
        | 'picture-in-picture'
        | 'standalone'
        | 'window-controls-overlay'
      ),
    ]
  | ['dynamic-range', 'standard' | 'high']
  | ['forced-colors', 'none' | 'active']
  | ['grid', '0' | '1']
  | ['height' | 'min-height' | 'max-height', Length]
  | ['hover', 'hover' | 'none']
  | ['inverted-colors', 'none' | 'inverted']
  | ['orientation', 'portrait' | 'landscape']
  | ['overflow-block', 'none' | 'scroll' | 'optional-paged' | 'paged']
  | ['overflow-inline', 'none' | 'scroll']
  | ['pointer', 'none' | 'coarse' | 'fine']
  | ['prefers-color-scheme', 'light' | 'dark']
  | ['prefers-contrast', 'no-preference' | 'more' | 'less' | 'custom']
  | ['resolution', CustomLength<'dpi'>]
  | [
      'min-resolution',
      CustomLength<'dpi'> | CustomLength<'dppx'> | CustomLength<'x'>,
    ]
  | ['max-resolution', CustomLength<'dpi'> | CustomLength<'dpcm'>]
  | ['update', 'none' | 'slow' | 'fast']
  | ['video-dynamic-range', 'standard' | 'high']
  | ['width' | 'min-width' | 'max-width', Length]
