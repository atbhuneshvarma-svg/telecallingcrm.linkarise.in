export interface CallDetail {
  mobile: string
  ldmid: number
  cmpmid: number
  leadmid: number
  actvity: string
  prospectname: string
  sourceofinquiry: string | null
  leademail: string
  address: string
  detail: string
  extra_field1: string | null
  extra_field2: string | null
  extra_field3: string | null
  purpose: string | null
  telecaller_name: string
  lead_name: string
  primary_mobile: string
  campaignname: string
  statusname: string
  statuscolor: string
  followup: number
  followupremark: string
  addedon: string
  calltype: string | null
  starttime: string
  endtime: string
  callduration: string
  updatedon: string
}
