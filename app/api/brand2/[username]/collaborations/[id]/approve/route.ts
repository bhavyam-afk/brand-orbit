import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { username: string; id: string } }) {
  try {
    const { username, id } = params

    const brand = await prisma.brandProfile.findFirst({ where: { username } })
    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 })

    const collab = await prisma.collaboration.findUnique({ where: { id } })
    if (!collab || collab.brandId !== brand.id) return NextResponse.json({ error: 'Collaboration not found for this brand' }, { status: 404 })

    // Mark content as approved and persist an approval note
    // Find the package collaboration that has a submitted draft (use draftSubmittedAt)
    const existing = await prisma.packageCollaboration.findFirst({ where: { collabId: id, draftSubmittedAt: { not: null } } })
    const prevContent = existing?.contentDraft ?? {}
    const newContent = { ...(typeof prevContent === 'object' ? prevContent : {}), brandFeedback: 'Approved' }

    if (!existing) return NextResponse.json({ error: 'PackageCollaboration not found' }, { status: 404 })
    console.log('approve: found packageCollab', { id: existing.id, collabId: existing.collabId, draftSubmittedAt: existing.draftSubmittedAt })
    console.log('approve: newContent', newContent)
    // If already approved, return existing state (idempotent)
    if ((existing as any).contentStatus === 'APPROVED' || (existing as any).draftapprovalAt) {
      const updatedExisting = await prisma.collaboration.findUnique({ where: { id }, include: { packageCollaborations: true, creator: true, package: true, brand: true } })
      return NextResponse.json({ collaboration: updatedExisting, success: true })
    }

    // Try updating top-level fields (preferred). If Prisma client doesn't accept them, fall back to writing into contentDraft JSON.
    const approvedContent = { ...(typeof newContent === 'object' ? newContent : {}), brandFeedback: 'Approved', approvedAt: new Date().toISOString() }
    try {
      const updateData: any = {
        contentDraft: approvedContent,
        contentStatus: 'APPROVED',
        brandFeedback: 'Approved',
        draftapprovalAt: new Date(),
      }
      await prisma.packageCollaboration.update({ where: { id: existing.id }, data: updateData })
    } catch (uerr) {
      console.warn('top-level update failed, falling back to contentDraft-only update', uerr)
      try {
        await prisma.packageCollaboration.update({ where: { id: existing.id }, data: { contentDraft: approvedContent as any } as any })
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
    console.error('approve route error', err)
    return NextResponse.json({ error: String((err as any)?.message || err) }, { status: 500 })
  }
}
