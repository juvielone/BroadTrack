import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import convert from 'heic-convert'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/heic', 'image/heif'])
const MAX_SIZE_BYTES = 15 * 1024 * 1024
const HEIC_TYPES = new Set(['image/heic', 'image/heif'])
const BUCKET = 'job-photos'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )
}

async function deleteStagingObject(
  supabase: Awaited<ReturnType<typeof getSupabase>>,
  stagingPath: string
) {
  const { error } = await supabase.storage.from(BUCKET).remove([stagingPath])
  if (error) {
    console.warn(`[step-photos] failed to delete staging object ${stagingPath}: ${error.message}`)
  }
}

function extensionFor(contentType: string): string {
  return contentType === 'image/png' ? 'png' : 'jpg'
}

export async function POST(request: Request) {
  const supabase = await getSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const stagingPath = body?.stagingPath
  const projectId = body?.projectId
  const jobId = body?.jobId
  const stepId = body?.stepId

  if (
    typeof stagingPath !== 'string' ||
    typeof projectId !== 'string' ||
    typeof jobId !== 'string' ||
    typeof stepId !== 'string'
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (stagingPath !== `staging/${jobId}/${stepId}/${stagingPath.split('/').pop()}`) {
    return NextResponse.json({ error: 'stagingPath does not match jobId/stepId' }, { status: 400 })
  }

  const { data: blob, error: downloadError } = await supabase.storage.from(BUCKET).download(stagingPath)
  if (downloadError || !blob) {
    return NextResponse.json({ error: 'Staging file not found' }, { status: 404 })
  }

  const contentType = blob.type
  const buffer = Buffer.from(await blob.arrayBuffer())

  if (buffer.byteLength > MAX_SIZE_BYTES) {
    await deleteStagingObject(supabase, stagingPath)
    return NextResponse.json({ error: 'File exceeds 15MB limit' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(contentType)) {
    await deleteStagingObject(supabase, stagingPath)
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
  }

  let outputBuffer: Buffer
  let finalContentType: string
  try {
    if (HEIC_TYPES.has(contentType)) {
      const converted = await convert({ buffer, format: 'JPEG', quality: 1 })
      outputBuffer = Buffer.from(converted)
      finalContentType = 'image/jpeg'
    } else {
      outputBuffer = buffer
      finalContentType = contentType
    }
  } catch {
    await deleteStagingObject(supabase, stagingPath)
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
  }

  const finalPath = `${projectId}/${jobId}/${stepId}/${Date.now()}.${extensionFor(finalContentType)}`
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(finalPath, outputBuffer, { contentType: finalContentType })

  if (uploadError) {
    await deleteStagingObject(supabase, stagingPath)
    return NextResponse.json({ error: 'Failed to store photo' }, { status: 500 })
  }

  const { error: insertError } = await supabase.from('step_photos').insert({ step_id: stepId, url: finalPath })

  if (insertError) {
    // Final object now orphaned (no delete permission on non-staging paths by design).
    console.error(`[step-photos] step_photos insert failed after final upload succeeded, orphaned path: ${finalPath}`)
    await deleteStagingObject(supabase, stagingPath)
    return NextResponse.json({ error: 'Failed to save photo record' }, { status: 500 })
  }

  await deleteStagingObject(supabase, stagingPath)

  return NextResponse.json({ path: finalPath }, { status: 200 })
}
