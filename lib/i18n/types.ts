export type LocaleCode =
  | "en"
  | "es"
  | "fr"
  | "pt"
  | "de"
  | "it"
  | "zh"
  | "ja"
  | "ko"
  | "ar"
  | "hi"
  | "id"
  | "tr"
  | "ru";

export type MessageTree = {
  nav: {
    home: string;
    groups: string;
    explore: string;
    wallet: string;
    profile: string;
  };
  common: {
    done: string;
    cancel: string;
    back: string;
    save: string;
    optional: string;
  };
  profile: {
    title: string;
    editProfile: string;
    paymentMethod: string;
    passwordSecurity: string;
    kycStatus: string;
    language: string;
    notifications: string;
    currency: string;
    tripHistory: string;
    settlementReminder: string;
    transactionHistory: string;
    helpCenter: string;
    rateApp: string;
    shareFriends: string;
    about: string;
    signOut: string;
  };
  language: {
    title: string;
    subtitle: string;
    updated: string;
    failed: string;
  };
  currency: {
    title: string;
    search: string;
    common: string;
    all: string;
    updated: string;
    failed: string;
    empty: string;
  };
  notifications: {
    title: string;
    settlements: string;
    settlementsDesc: string;
    groupsTrips: string;
    groupsTripsDesc: string;
    explore: string;
    exploreDesc: string;
  };
  help: {
    title: string;
    heading: string;
    contactPrefix: string;
  };
  kyc: {
    title: string;
    pendingHeading: string;
    pendingBody: string;
    failedHeading: string;
    failedBody: string;
    verifiedHeading: string;
    verifiedBody: string;
    pending: string;
    failed: string;
    verified: string;
  };
  changePassword: {
    title: string;
    current: string;
    newPassword: string;
    repeat: string;
    submit: string;
    updating: string;
    updated: string;
    ruleHint: string;
    mismatch: string;
    sameAsCurrent: string;
  };
  editProfile: {
    title: string;
    editPhoto: string;
    name: string;
    username: string;
    updated: string;
    failed: string;
  };
  photo: {
    title: string;
    take: string;
    choose: string;
    delete: string;
  };
};
