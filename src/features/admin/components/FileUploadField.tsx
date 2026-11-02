'use client'

import { CheckCircle2, LoaderCircle, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ui from '../ui.module.css'

const BUCKET = 'media'
const MAX_BYTES = 8 * 1024 * 1024

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif']

export type UploadKind = 'profile' | 'projects' | 'screenshots' | 'certificates' | 'cv'

const ACCEPTED: Record<UploadKind, string> = {
  profile: IMAGE_TYPES.join(','),
  projects: IMAGE_TYPES.join(','),
  screenshots: IMAGE_TYPES.join(','),
  certificates: `${IMAGE_TYPES.join(',')},application/pdf`,
  cv: 'application/pdf',
}

/**
 * Uploads a file directly to Supabase Storage from the browser using the
 * admin session (RLS/storage policies must authorize admin writes).
 * The stored public URL is placed in a hidden input for form submission.
 */
export function FileUploadField({
  name,
  kind,
  initialValue,
  label,
  multiple = false,
  captionName,
}: {
  name: string
  kind: UploadKind
  /** Pre-existing public URL to display as the current value. */
  initialValue?: string | null
  label: string
  multiple?: boolean
  /** When uploading multiple images, the hidden input name for alt text. */
  captionName?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [values, setValues] = useState<string[]>(
    initialValue ? initialValue.split(/\s+/).filter(Boolean) : [],
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function upload(files: FileList | null) {
    setDone(false)
    if (!files || files.length === 0) return
    const list = Array.from(files)
    const badType = list.some(
      (file) =>
        !ACCEPTED[kind].split(',').includes(file.type) &&
        !(kind === 'cv' && file.name.toLowerCase().endsWith('.pdf')),
    )
    if (badType) {
      setError(
        kind === 'cv'
          ? 'Only PDF documents are allowed.'
          : kind === 'certificates'
            ? 'Only images or PDF files are allowed.'
            : 'Only PNG, JPG, WEBP, AVIF or GIF images are allowed.',
      )
      return
    }
    const tooBig = list.some((file) => file.size > MAX_BYTES)
    if (tooBig) {
      setError('Files must be 8 MB or smaller.')
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
      const uploaded: string[] = []
      for (const file of list) {
        const path = `${kind}/${Date.now()}-${crypto.randomUUID()}.${extension(file.name)}`
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { cacheControl: '3600', upsert: false })
        if (uploadError) throw new Error('Upload was rejected.')
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
      setValues(multiple ? [...values, ...uploaded] : uploaded.slice(0, 1))
      setDone(true)
    } catch {
      setError('Upload failed. Try a smaller file or check server policies.')
    } finally {
      setBusy(false)
    }
  }

  const hasValue = values.length > 0

  return (
    <div className={ui.field}>
      <label className={ui.label}>
        {label}
        {multiple && hasValue ? ` (${values.length} file${values.length === 1 ? '' : 's'})` : ''}
      </label>

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
          {busy ? 'Uploading…' : hasValue ? 'Replace file' : 'Upload file'}
        </button>
        {done ? (
          <span className={ui.statusInline}>
            <CheckCircle2 size={14} aria-hidden={true} /> Uploaded
          </span>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED[kind]}
        multiple={multiple}
        className={ui.fileInput}
        onChange={(event) => {
          void upload(event.target.files)
          event.target.value = ''
        }}
        tabIndex={-1}
        aria-hidden={true}
      />

      {values.map((url, index) => (
        <input
          key={`${url}-${index}`}
          type="hidden"
          name={name}
          value={url}
        />
      ))}

      {multiple ? (
        <ul className={ui.uploadList}>
          {values.map((url, index) => (
            <li key={url} className={ui.uploadListItem}>
              <span className={ui.uploadName}>{fileName(url)}</span>
              {captionName ? (
                <input
                  type="text"
                  name={captionName}
                  placeholder="Alt text (describe the image)"
                  className={ui.smallInput}
                  defaultValue=""
                  aria-label={`Alt text for image ${index + 1}`}
                />
              ) : null}
              <button
                type="button"
                className={ui.linkButton}
                onClick={() => setValues(values.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : hasValue ? (
        <p className={ui.statusInline}>{fileName(values[0])}</p>
      ) : null}

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

function fileName(url: string): string {
  try {
    const path = new URL(url).pathname
    const decoded = decodeURIComponent(path)
    const segments = decoded.split('/')
    const last = segments[segments.length - 1]
    return /\.[a-z0-9]{2,8}$/i.test(last) ? stripTimestamp(last) : url
  } catch {
    return url
  }
}

function stripTimestamp(name: string): string {
  return name.replace(/^\d{13}-[0-9a-f-]{36}\./i, '')
}
