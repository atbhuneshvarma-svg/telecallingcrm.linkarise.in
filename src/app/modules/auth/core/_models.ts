export interface AuthModel {
  token: string;
  api_token: string;
  refreshToken?: string;
}

export interface UserAddressModel {
  addressLine: string;
  city: string;
  state: string;
  postCode: string;
}

export interface UserCommunicationModel {
  email: boolean;
  sms: boolean;
  phone: boolean;
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean;
  sendCopyToPersonalEmail?: boolean;
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean;
    youAreSentADirectMessage?: boolean;
    someoneAddsYouAsAsAConnection?: boolean;
    uponNewOrder?: boolean;
    newMembershipApproval?: boolean;
    memberRegistration?: boolean;
  };
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean;
    tipsOnGettingMoreOutOfKeen?: boolean;
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean;
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean;
    tipsOnStartBusinessProducts?: boolean;
  };
}

export interface UserSocialNetworksModel {
  linkedIn: string;
  facebook: string;
  twitter: string;
  instagram: string;
}

export interface UserModel {
  id: number;
  user: {
    usermid: number;
    username: string;
    company: {
      cmpmid: number;
      teamleader: number;
    };
    usermobile?: string;
    userloginid: string;
    userstatus: string;
    usertype: string;
    userrole: string;
    userlastlogintime?: string;
    usernooflogin?: number;
    userregip?: string;
    designation?: string;
    detail?: string;
    useremail?: string;
    updated_at?: string;
    created_at?: string;
    cmpmid?: number;
  };
  username: string;
  password: string | undefined;
  email: string;
  first_name: string;
  last_name: string;
  fullname?: string;
  occupation?: string;
  companyName?: string;
  phone?: string;
  roles?: Array<number>;
  pic?: string;
  language?: "en" | "de" | "es" | "fr" | "ja" | "zh" | "ru";
  timeZone?: string;
  website?: "https://keenthemes.com";
  emailSettings?: UserEmailSettingsModel;
  auth?: AuthModel;
  communication?: UserCommunicationModel;
  address?: UserAddressModel;
  socialNetworks?: UserSocialNetworksModel;
}

export interface DashboardStats {
  todayCalls: number;
  todayAnswered: number;
  todayFollowup: number;
  interested: number;
  converted: number;
  notInterested: number;
  freshLeadsToday: number;
  totalLeads: number;

  performanceTop5: {
    username: string;
    dialCall: number;
    ansCall: number;
    interested: number;
    notinterested: number;
    converted_to_client: number;
    callDuration: string;
    freshLeads: number;
    totalLeads: number;
  }[];

  recentConfirmed: RecentConfirmedLead[];

  weekly: {
    weekNames: string[];
    total: number[];
    converted: number[];
  };

  barChart: {
    users: string[];
    total: number[];
    answered: number[];
    converted: number[];
  };

  todayLeadCount?: number;
}

export interface RecentConfirmedLead {
  leadmid: number;
  cmpmid: number;
  campaignmid: number;
  sourceofinquirymid: number;
  purposemid: number;

  name: string;
  phone: string;
  email: string | null;
  gender: string | null;
  dob: string | null;
  marital_status: string | null;
  detail: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  occupation: string | null;
  annual_income: string | null;
  pan_number: string | null;
  aadhaar_number: string | null;
  kyc_status: string | null;

  stage: string;
  stagedate: string;
  statusname: string;
  statusdate: string;
  clientstatus: string;
  statuscolor: string;

  activityname: string | null;
  followup: number;
  followupdate: string | null;
  iscalled: number;
  leadremarks: string | null;

  statusmid: number;
  usermid: number;
  addedby: number | null;
  updatedby: number | null;
  counsellorid: number | null;
  leadermid: number;

  isclient: number;
  extra_field1: string | null;
  extra_field2: string | null;
  extra_field3: string | null;

  created_at: string;
  updated_at: string;
}

/* -------------------------
   Notifications
------------------------- */
export interface Notification {
  notimid: number;
  cmpmid: number;
  usermid: number;
  title: string;
  message: string;
  type: string;
  related_id: number | null;
  related_ids: string;
  related_table: string;
  is_read: number;
  addedby: number;
  created_at: string;
}

export interface NotificationsResponse {
  result: boolean;
  message: string;
  data: Notification[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}
