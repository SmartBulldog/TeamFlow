import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GDPR Data Export API
 * Allows users to export all their personal data in JSON format
 * Complies with GDPR Article 15 (Right of Access) and Article 20 (Right to Data Portability)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to export your data' },
        { status: 401 }
      )
    }

    // Find user with all related data
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: {
          include: {
            cards: true,
            members: true
          }
        },
        memberOf: {
          include: {
            workspace: {
              include: {
                cards: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove sensitive data (password hash) before export
    const { passwordHash, ...userData } = user

    // Prepare export data
    const exportData = {
      exportDate: new Date().toISOString(),
      exportVersion: '1.0',
      dataSubject: {
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      },
      workspaces: userData.workspaces.map(workspace => ({
        id: workspace.id,
        name: workspace.name,
        createdAt: workspace.createdAt,
        cards: workspace.cards,
        members: workspace.members
      })),
      memberships: userData.memberOf.map(membership => ({
        role: membership.role,
        joinedAt: membership.joinedAt,
        workspace: {
          id: membership.workspace.id,
          name: membership.workspace.name,
          cards: membership.workspace.cards
        }
      }))
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="teamflow-data-export-${Date.now()}.json"`
      }
    })
  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data. Please try again later' },
      { status: 500 }
    )
  }
}
