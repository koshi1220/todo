export interface AppUser {
    uid: string;
    internalId: string;    // "google:xxxx", "email:xxx", "anon:xxx"
    externalId?: string;   // Gmailアドレスやメール
    displayName?: string;
    isAnonymous: boolean;
  }
  