export interface FollowupLead {
  leadmid: number
  cmpmid: number
  campaignname: string
  companymid: number
  sourceofinquiry: string | null
  purpose: string | null
  address: string | null
  activity: string | null
  detail: string | null
  extra_field1: string | null
  extra_field2: string | null
  extra_field3: string | null
  username: string
  leadname: string
  phone: string
  email: string
  statusname: string
  followup: number
  followupdate: string
  leadremarks: string | null
  usermid: number
  iscalled: number
  calltype: string | null
  starttime: string | null
  endtime: string | null
  callduration: string | null
  created_at: string
  followup_updatedate: string
}
