import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { username: string; id: string } }) {
  try {
    const { username, id } = params
    const body = await request.json().catch(() => ({}))
    const message = String(body?.message ?? '')

    const brand = await prisma.brandProfile.findFirst({ where: { username } })
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 })

    const collab = await prisma.collaboration.findUnique({ where: { id } })
    if (!collab || collab.brandId !== brand.id) return NextResponse.json({ error: 'Collaboration not found for this brand' }, { status: 404 })

    // Read existing contentDraft (if any) and attach brandFeedback; mark content as under review
    // Find the package collaboration that has a submitted draft (use draftSubmittedAt)
    const existing = await prisma.packageCollaboration.findFirst({ where: { collabId: id, draftSubmittedAt: { not: null } } })
    const prevContent = existing?.contentDraft ?? {}
    const newContent = { ...(typeof prevContent === 'object' ? prevContent : {}), brandFeedback: message }

    if (!existing) return NextResponse.json({ error: 'PackageCollaboration not found' }, { status: 404 })
    console.log('request-improvements: found packageCollab', { id: existing.id, collabId: existing.collabId, draftSubmittedAt: existing.draftSubmittedAt })
    console.log('request-improvements: newContent', newContent)
    // If already under review with same feedback, return existing (idempotent)
    if ((existing as any).contentStatus === 'UNDER_REVIEW' && (existing as any).brandFeedback === message) {
      const updatedExisting = await prisma.collaboration.findUnique({ where: { id }, include: { packageCollaborations: true, creator: true, package: true, brand: true } })
      return NextResponse.json({ collaboration: updatedExisting, success: true })
    }

    const improvContent = { ...(typeof newContent === 'object' ? newContent : {}), brandFeedback: message }
    if ((improvContent as any).approvedAt) delete (improvContent as any).approvedAt

    try {
      const updateData: any = { contentDraft: improvContent, contentStatus: 'UNDER_REVIEW', brandFeedback: message, draftapprovalAt: null }
      await prisma.packageCollaboration.update({ where: { id: existing.id }, data: updateData })
    } catch (uerr) {
      console.warn('top-level update failed for request-improvements, falling back to contentDraft-only', uerr)
      try {
        await prisma.packageCollaboration.update({ where: { id: existing.id }, data: { contentDraft: improvContent as any } as any })
      } catch (uerr2) {
        console.error('fallback packageCollab update failed', uerr2)
        return NextResponse.json({ error: String((uerr2 as any)?.message || uerr2), detail: uerr2 }, { status: 500 })
      }
    }

    const updated = await prisma.collaboration.findUnique({
      where: { id },
      include: { packageCollaborations: true, creator: true, package: true, brand: true },
    })

    return NextResponse.json({ collaboration: updated, success: true })
  } catch (err) {
    console.error('request-improvements route error', err)
    return NextResponse.json({ error: String((err as any)?.message || err) }, { status: 500 })
  }
}
