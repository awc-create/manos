import 'next-auth';
import 'next-auth/jwt';

type AdminRole = 'HEAD' | 'ADMIN' | 'STAFF' | 'CLIENT';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: AdminRole;
    };
  }

  interface User {
    role?: AdminRole;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: AdminRole;
    picture?: string | null;
  }
}
