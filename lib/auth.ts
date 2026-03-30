import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const SESSION_COOKIE_NAME = "openfloor_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export interface SessionUser {
  sub: string;
  username: string;
  name: string;
  email: string | null;
  picture: string | null;
}

export interface AppSession {
  user: SessionUser;
}

function normalizeUsername(username: string) {
  return username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function buildSessionUser(username: string): SessionUser {
  const displayName = username.trim().slice(0, 40);
  const normalized = normalizeUsername(displayName);

  if (!displayName || !normalized) {
    throw new Error("A valid username is required");
  }

  return {
    sub: `local:${normalized}`,
    username: normalized,
    name: displayName,
    email: null,
    picture: null,
  };
}

function encodeSession(user: SessionUser) {
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}

function decodeSession(value: string): SessionUser | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<SessionUser>;

    if (
      typeof parsed.sub !== "string" ||
      typeof parsed.username !== "string" ||
      typeof parsed.name !== "string"
    ) {
      return null;
    }

    return {
      sub: parsed.sub,
      username: parsed.username,
      name: parsed.name,
      email: parsed.email ?? null,
      picture: parsed.picture ?? null,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!cookieValue) {
    return null;
  }

  const user = decodeSession(cookieValue);
  return user ? { user } : null;
}

export async function requireAuth() {
  return getSession();
}

export function applySessionCookie(response: NextResponse, user: SessionUser) {
  response.cookies.set(SESSION_COOKIE_NAME, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getOrCreateCurrentUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  let user = await db.select().from(users).where(eq(users.auth0Sub, session.user.sub)).get();

  if (!user) {
    [user] = await db
      .insert(users)
      .values({
        auth0Sub: session.user.sub,
        email: session.user.email,
        displayName: session.user.name,
        avatarUrl: session.user.picture,
      })
      .returning();
  } else if (user.displayName !== session.user.name) {
    [user] = await db
      .update(users)
      .set({ displayName: session.user.name })
      .where(eq(users.id, user.id))
      .returning();
  }

  return user;
}
