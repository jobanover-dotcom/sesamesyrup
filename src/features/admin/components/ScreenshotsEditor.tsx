'use client'

import { LoaderCircle, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ui from '../ui.module.css'

type ImageRow = { url: string; alt: string }

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif']

/**
 * Managed list of project screenshots: upload, alt text and remove, rendered
 * as hidden `image_url` inputs + visible `image_alt` text inputs.
 */
export function ScreenshotsEditor({
  initial,
}: {
  initial: ImageRow[]
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<ImageRow[]>(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return
    const list = Array.from(files)
    if (list.some((file) => !IMAGE_TYPES.includes(file.type))) {
      setError('Only PNG, JPG, WEBP, AVIF or GIF images are allowed.')
      return
    }
    if (list.some((file) => file.size > 8 * 1024 * 1024)) {
      setError('Each screenshot must be 8 MB or smaller.')
      return
    }
    if (rows.length + list.length > 12) {
      setError('A project can have at most 12 screenshots.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Storage is not configured yet. Complete the Supabase setup first.')
        return
      }
      const uploaded: ImageRow[] = []
      for (const file of list) {
        const path = `screenshots/${Date.now()}-${crypto.randomUUID()}.${extension(file.name)}`
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(path, file, { cacheControl: '3600', upsert: false })
        if (uploadError) throw new Error('rejected')
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        uploaded.push({ url: data.publicUrl, alt: '' })
      }
      setRows((current) => [...current, ...uploaded])
    } catch {
      setError('Upload failed. Check storage policies and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={ui.field}>
      <label className={ui.label}>Screenshots ({rows.length}/12)</label>

      <div className={ui.uploadRow}>
        <button
          type="button"
          className={ui.ghostButton}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? (
            <LoaderCircle size={14} className={ui.spin} aria-hidden={true} />
          ) : (
            <Upload size={14} aria-hidden={true} />
          )}
          {busy ? 'Uploading…' : 'Add screenshots'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        multiple
        className={ui.fileInput}
        onChange={(event) => {
          void upload(event.target.files)
          event.target.value = ''
        }}
        tabIndex={-1}
        aria-hidden={true}
      />

      {rows.length === 0 ? (
        <p className={ui.hint}>No screenshots yet. Upload full-color images visitors see in the project modal.</p>
      ) : (
        <ul className={ui.screenshotList}>
          {rows.map((row, index) => (
            <li key={row.url} className={ui.screenshotRow}>
              <input type="hidden" name="image_url" value={row.url} />
              <input
                type="text"
                name="image_alt"
                placeholder="Alt text"
                value={row.alt}
                onChange={(event) =>
                  setRows(
                    rows.map((current, i) =>
                      i === index
                        ? { ...current, alt: event.target.value }
                        : current,
                    ),
                  )
                }
                className={ui.smallInput}
                aria-label={`Alt text for screenshot ${index + 1}`}
              />
              <button
                type="button"
                className={ui.linkButton}
                aria-label={`Remove screenshot ${index + 1}`}
                onClick={() => setRows(rows.filter((_, i) => i !== index))}
              >
                <Trash2 size={14} aria-hidden={true} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error ? (
        <p role="alert" className={ui.statusError}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function extension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() || 'bin' : 'bin'
}
