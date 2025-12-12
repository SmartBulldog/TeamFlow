import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * GDPR Data Deletion API
 * Allows users to permanently delete their account and all associated data
 * Complies with GDPR Article 17 (Right to Erasure / Right to be Forgotten)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to delete your account' },
        { status: 401 }
      )
    }

    // Find user to ensure they exist
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
        memberOf: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse request body for confirmation
    const body = await request.json()
    const { confirmEmail } = body

    // Require email confirmation for safety
    if (confirmEmail !== user.email) {
      return NextResponse.json(
        { error: 'Email confirmation does not match. Please provide your email to confirm deletion' },
        { status: 400 }
      )
    }

    // Delete user and all related data (cascading deletion handled by Prisma)
    // This will delete:
    // - User account
    // - Owned workspaces
    // - Workspace memberships
    // - Associated cards
    await db.user.delete({
      where: { id: user.id }
    })

    return NextResponse.json(
      {
        message: 'Account and all associated data have been permanently deleted',
        deletedAt: new Date().toISOString(),
        email: user.email
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Data deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account. Please try again later or contact support' },
      { status: 500 }
    )
  }
}
