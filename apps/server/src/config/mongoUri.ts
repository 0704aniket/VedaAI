function encodeMongoPassword(password: string): string {
  if (password.includes("%")) {
    return password;
  }
  return encodeURIComponent(password);
}

function buildMongoUriFromParts(): string | null {
  const user = process.env.MONGODB_USER?.trim();
  const password = process.env.MONGODB_PASSWORD?.trim();
  const host = process.env.MONGODB_CLUSTER_HOST?.trim();
  const db = process.env.MONGODB_DB?.trim() || "vedaai";

  if (!user || !password || !host) {
    return null;
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeMongoPassword(password);

  return `mongodb+srv://${encodedUser}:${encodedPassword}@${host}/${db}?retryWrites=true&w=majority`;
}

export function resolveMongoUri(): string {
  const fromParts = buildMongoUriFromParts();
  if (fromParts) {
    return fromParts;
  }

  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    return "mongodb://localhost:27017/vedaai";
  }

  if (uri.includes("YOUR_MONGODB_PASSWORD")) {
    throw new Error(
      "Set MONGODB_PASSWORD (and MONGODB_USER / MONGODB_CLUSTER_HOST) or a real MONGODB_URI in apps/server/.env"
    );
  }

  return uri;
}
