import "dotenv/config";

export const users = {
  admin: {
    email: process.env.ADMIN_EMAIL!,
    password: process.env.ADMIN_PASSWORD!,
    role: "admin",
  },

  viewer: {
    email: process.env.VIEWER_EMAIL!,
    password: process.env.VIEWER_PASSWORD!,
    role: "viewer",
  },
};
