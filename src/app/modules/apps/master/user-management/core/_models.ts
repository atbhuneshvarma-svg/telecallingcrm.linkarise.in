// core/_models.ts
export interface User {
  usermid: number;
  username: string;
  userloginid: string;
  userpassword: string;
  useremail: string;
  usermobile: string;
  userrole: 'teamleader' | 'manager' | 'telecaller' | 'admin';
  usertype?: 'Admin' | 'User';
  roleid?: number;
  userstatus: 'Active' | 'Inactive';
  designation?: string;
  detail?: string;
  avatar?: string;
  cmpmid?: number;
  initials?: {
    label: string;
    state: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  };
  created_at?: string;
  updated_at?: string;
}

// For the UsersList component props
export interface UsersListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

// For the UserModal component props
export interface UserModalProps {
  show: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  user: User;
  setUser: (user: User) => void;
  onSubmit: () => void;
}

// Pagination interface
export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// API Response interfaces
export interface ApiResponse<T> {
  result: boolean;
  message?: string;
  data: T;
  current_page?: number;
  per_page?: number;
  total_records?: number;
  total_pages?: number;
}

export interface PaginatedResponse {
  data: User[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}
