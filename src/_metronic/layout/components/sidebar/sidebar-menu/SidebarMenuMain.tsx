import { useIntl } from 'react-intl';
import { useAuth } from '../../../../../app/modules/auth';
import { SidebarMenuItem } from './SidebarMenuItem';
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub';

const SidebarMenuMain = () => {
  const intl = useIntl();
  const { currentUser } = useAuth();

  const userRole = currentUser?.user?.userrole || 'telecaller';
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const isTelecaller = userRole === 'telecaller';
  const isTeamleader = userRole === "teamleader";

  return (
    <>
      {/* ===== DASHBOARD & QUICK ACCESS ===== */}
      <SidebarMenuItem
        to="/dashboard"
        icon="element-11"
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        fontIcon="bi-speedometer2"
      />


      {(isAdmin || isManager) && (
        <>
          <SidebarMenuItem
            to="/master/campaigns"
            title="Campaigns"
            icon="abstract-26"
            fontIcon="bi-megaphone"
          />
        </>
      )}
      {/* ===== LEAD MANAGEMENT ===== */}
      <SidebarMenuItem
        to="/leads/allleads"
        icon="user-tick"
        title="Lead Management"
        fontIcon="bi-list-ul"
      />
      {(isAdmin || isManager) && (
        <>
          <SidebarMenuItem
            to="leads/allocate"
            title="Lead Allocation"
            icon="arrow-right-left"
            fontIcon="bi-arrow-left-right"
          />
        </>
      )}

      <SidebarMenuItem
        to="/leads/freshleads"
        icon="abstract-28"
        title="Fresh Leads"
        fontIcon="bi-lightning-charge"
      />

      <SidebarMenuItem
        to="leads/followup"
        title="Follow-ups"
        icon="calendar-tick"
        fontIcon="bi-clock-history"
      />

      <SidebarMenuItem
        to="leads/call-details"
        title="Lead History"
        icon="call"
        fontIcon="bi-telephone"
      />



      {isTelecaller || isTeamleader && (
        <>
          <SidebarMenuItem
            to="/reports/converted"
            title="Converted Leads"
            icon="arrow-right"
            fontIcon="bi-person-check"
          />

          <SidebarMenuItem
            to="/reports/allactivity"
            title="Activity Logs"
            icon="abstract-42"
            fontIcon="bi-activity"
          />
        </>
      )}



      {/* ===== USER MANAGEMENT ===== */}
      {(isAdmin || isManager) && (
        <>
          <SidebarMenuItemWithSub
            to="/manage"
            title="User Management"
            icon="profile-user"
            fontIcon="bi-people"
          >
            {isAdmin && (
              <SidebarMenuItem
                to="manage/user-management/users"
                title="Users"
                icon="user-square"
                fontIcon="bi-person"
                hasBullet={true}
              />
            )}
            <SidebarMenuItem
              to="manage/teams"
              title="Teams"
              icon="people"
              fontIcon="bi-diagram-3"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
        </>
      )}

      {/* ===== MASTER DATA MANAGEMENT ===== */}
      {isAdmin && (
        <SidebarMenuItemWithSub
          to="/master"
          title="Master Data"
          icon="setting"
          fontIcon="bi-gear"
        >
          <SidebarMenuItem
            to="/master/status"
            title="Status Types"
            icon="abstract-43"
            fontIcon="bi-shield-check"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/master/activity"
            title="Activities"
            icon="abstract-42"
            fontIcon="bi-activity"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/master/purpose"
            title="Purposes"
            icon="abstract-41"
            fontIcon="bi-bookmark-check"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/master/sourceOFinquiry"
            title="Lead Source"
            icon="abstract-40"
            fontIcon="bi-box-seam"
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>
      )}

      {/* ===== ADMIN REPORTS & ANALYTICS ===== */}
      {(isAdmin || isManager) && (
        <>

          <SidebarMenuItemWithSub
            to="/reports"
            title="Reports & Analytics"
            icon="chart-line"
            fontIcon="bi-graph-up"
          >
            <SidebarMenuItem
              to="/reports/performance"
              title="Performance Report"
              icon="user-tick"
              fontIcon="bi-person-check"
              hasBullet={true}
            />
            <SidebarMenuItem
              to="/reports/converted"
              title="Converted Leads"
              icon="arrow-right"
              fontIcon="bi-person-check"
              hasBullet={true}
            />
            <SidebarMenuItem
              to="/reports/allactivity"
              title="Activity Logs"
              icon="abstract-42"
              fontIcon="bi-activity"
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
        </>
      )}
    </>
  );
};

export { SidebarMenuMain };