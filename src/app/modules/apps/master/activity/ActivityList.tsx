// src/app/modules/apps/master/activity/ActivityList.tsx
import React from 'react'
import { Activity } from './core/_request'

interface ActivityListProps {
  activities: Activity[]
  onEditActivity: (activity: Activity) => void
  onDeleteActivity: (id: number) => void
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  activities, 
  onEditActivity, 
  onDeleteActivity 
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-rounded table-striped border gy-7 gs-7">
        <thead>
          <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
            <th>Sr.No</th>
            <th>Activity Name</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-10">
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-inbox fs-2x text-muted mb-2"></i>
                  <span className="text-muted fs-6">No activities found</span>
                </div>
              </td>
            </tr>
          ) : (
            activities.map((activity, index) => (
              <tr key={activity.id}>
                <td>
                  <span className="text-gray-600">{index + 1}</span>
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <span className="fw-bold text-gray-800">{activity.name}</span>
                  </div>
                </td>
                <td className="text-end">
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-light btn-active-light-primary"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Actions
                      <i className="bi bi-chevron-down ms-2"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onEditActivity(activity)}
                        >
                          <i className="bi bi-pencil me-2"></i>
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => onDeleteActivity(activity.id)}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ActivityList