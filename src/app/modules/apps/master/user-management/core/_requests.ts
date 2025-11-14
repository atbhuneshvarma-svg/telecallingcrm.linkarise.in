// core/_requests.ts
import axios from 'axios';
import { User } from './_models';

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;

// Endpoints
const GET_USERS_URL = `${API_URL}/userslist`;
const CREATE_USER_URL = `${API_URL}/adduser`;
const EDIT_USER_URL = `${API_URL}/edituser`;
const DELETE_USER_URL = `${API_URL}/deleteuser`;

// API Response interfaces
interface ApiResponse<T> {
  result: boolean;
  message?: string;
  data: T;
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

interface PaginatedResponse {
  data: User[];
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// ✅ Get users with pagination
export const getUsers = async (
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedResponse> => {
  const response = await axios.post<ApiResponse<any[]>>(
    `${GET_USERS_URL}?page=${page}&per_page=${perPage}`
  );

  console.log('Full API Response:', response.data);

  if (!response.data.result) {
    throw new Error(response.data.message || 'Failed to fetch users');
  }

  return {
    data: response.data.data.map((item: any) => ({
      usermid: item.usermid,
      username: item.username,
      userloginid: item.userloginid,
      userpassword: item.userpassword,
      useremail: item.useremail,
      usermobile: item.usermobile,
      userrole: item.userrole || 'User',
      usertype: item.usertype || 'User', // ✅ ADDED
      userstatus: item.userstatus || 'Active',
      designation: item.designation || '',
      detail: item.detail || '',
      avatar: item.avatar || 'avatars/300-6.jpg',
      cmpmid: item.cmpmid,
      initials: item.initials || { label: '', state: 'primary' },
      created_at: item.created_at,
      updated_at: item.updated_at,
    })),
    current_page: response.data.current_page,
    per_page: response.data.per_page,
    total_records: response.data.total_records,
    total_pages: response.data.total_pages,
  };
};

// ✅ Create user
export const createUser = async (user: Omit<User, 'usermid'>): Promise<User> => {
  // Provide default values for optional fields
  const username = user.username || '';
  const userloginid = user.userloginid || '';
  const userpassword = user.userpassword || '';
  const useremail = user.useremail || '';
  const usermobile = user.usermobile || '';
  const userrole = user.userrole || 'User';
  const usertype = user.usertype || 'User'; // ✅ ADDED
  const roleid = user.roleid || 0;
  const userstatus = user.userstatus || 'Active';
  const designation = user.designation || '';
  const detail = user.detail || '';

  const response = await axios.post<ApiResponse<any>>(`${CREATE_USER_URL}`, {
    username: username,
    userloginid: userloginid,
    userpassword: userpassword,
    useremail: useremail,
    usermobile: usermobile,
    userrole: userrole,
    usertype: usertype, // ✅ ADDED
    roleid: roleid,
    userstatus: userstatus,
    designation: designation,
    detail: detail,
  });

  if (response.status !== 200) {
    throw new Error(response.data.message || 'Failed to create user');
  }

  const item = response.data.data;
  return {
    usermid: item.usermid,
    username: item.username,
    userloginid: item.userloginid,
    userpassword: item.userpassword,
    useremail: item.useremail,
    usermobile: item.usermobile,
    userrole: item.userrole || 'User',
    usertype: item.usertype || 'User', // ✅ ADDED
    roleid: item.roleid || 0, // ✅ ADDED
    userstatus: item.userstatus || 'Active',
    designation: item.designation || '',
    detail: item.detail || '',
    avatar: item.avatar || 'avatars/300-6.jpg',
    cmpmid: item.cmpmid,
    initials: item.initials || { label: '', state: 'primary' },
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
};

// ✅ Update user
export const updateUser = async (id: number, user: Omit<User, 'usermid'>): Promise<User> => {
  const response = await axios.put<ApiResponse<any>>(`${EDIT_USER_URL}/${id}`, {
    username: user.username || '',
    userloginid: user.userloginid || '',
    useremail: user.useremail || '',
    usermobile: user.usermobile || '',
    userrole: user.userrole || 'User',
    usertype: user.usertype || 'User', // ✅ ADDED
    roleid: user.roleid || 0, // ✅ ADDED
    userstatus: user.userstatus || 'Active',
    designation: user.designation || '',
    detail: user.detail || '',
  });
  console.log('update user Response:', response.data);

  if (response.status !== 200) {
    throw new Error(response.data.message || 'Failed to update user');
  }

  const item = response.data.data;
  return {
    usermid: item.usermid,
    username: item.username,
    userloginid: item.userloginid,
    userpassword: item.userpassword,
    useremail: item.useremail,
    usermobile: item.usermobile,
    userrole: item.userrole || 'User',
    usertype: item.usertype || 'User', // ✅ ADDED
    roleid: item.roleid || 0, // ✅ ADDED
    userstatus: item.userstatus || 'Active',
    designation: item.designation || '',
    detail: item.detail || '',
    avatar: item.avatar || 'avatars/300-6.jpg',
    cmpmid: item.cmpmid,
    initials: item.initials || { label: '', state: 'primary' },
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
};

// ✅ Delete user
export const deleteUser = async (id: number): Promise<void> => {
  const response = await axios.delete<ApiResponse<void>>(`${DELETE_USER_URL}/${id}`);

  if (!response.data.result) {
    throw new Error(response.data.message || 'Failed to delete user');
  }
};

// Enhanced API object
export const userApi = {
  // Get users with pagination
  async getUsersPaginated(page: number = 1, perPage: number = 10): Promise<PaginatedResponse> {
    try {
      const response = await axios.post<ApiResponse<any[]>>(
        `${GET_USERS_URL}?page=${page}&per_page=${perPage}`
      );

      if (!response.data.result) {
        throw new Error(response.data.message || 'API returned false result');
      }

      return {
        data: response.data.data.map((item: any) => ({
          usermid: item.usermid,
          username: item.username,
          userloginid: item.userloginid,
          userpassword: item.userpassword,
          useremail: item.useremail,
          usermobile: item.usermobile,
          userrole: item.userrole || 'User',
          usertype: item.usertype || 'User', // ✅ ADDED
          roleid: item.roleid || 0, // ✅ ADDED
          userstatus: item.userstatus || 'Active',
          designation: item.designation || '',
          detail: item.detail || '',
          avatar: item.avatar || 'avatars/300-6.jpg',
          cmpmid: item.cmpmid,
          initials: item.initials || { label: '', state: 'primary' },
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total_records: response.data.total_records,
        total_pages: response.data.total_pages,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Create new user - FIXED VERSION
  async createUser(user: Omit<User, 'usermid'>): Promise<User> {
    try {
      const response = await axios.post<ApiResponse<any>>(CREATE_USER_URL, {
        username: user.username || '',
        userloginid: user.userloginid || '',
        userpassword: user.userpassword || '',
        useremail: user.useremail || '',
        usermobile: user.usermobile || '',
        userrole: user.userrole || 'User',
        usertype: user.usertype || 'User', // ✅ ADDED
        roleid: user.roleid || 0, // ✅ ADDED
        userstatus: user.userstatus || 'Active',
        designation: user.designation || '',
        detail: user.detail || '',
      });

      console.log('Create user response:', response.data);

      if (response.status !== 200) {
        throw new Error(response.data.message || 'API returned false result');
      }

      // Handle case where API doesn't return user data
      const item = response.data.data;
      if (!item) {
        console.log('Creating temporary user object');
        return {
          usermid: Date.now(),
          username: user.username || '',
          userloginid: user.userloginid || '',
          userpassword: user.userpassword || '',
          useremail: user.useremail || '',
          usermobile: user.usermobile || '',
          userrole: user.userrole || 'User',
          usertype: user.usertype || 'User', // ✅ ADDED
          roleid: user.roleid || 0, // ✅ ADDED
          userstatus: user.userstatus || 'Active',
          designation: user.designation || '',
          detail: user.detail || '',
          avatar: user.avatar || 'avatars/300-6.jpg',
          cmpmid: user.cmpmid,
          initials: user.initials || { label: '', state: 'primary' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      return {
        usermid: item.usermid,
        username: item.username,
        userloginid: item.userloginid,
        userpassword: item.userpassword,
        useremail: item.useremail,
        usermobile: item.usermobile,
        userrole: item.userrole || 'User',
        usertype: item.usertype || 'User', // ✅ ADDED
        roleid: item.roleid || 0, // ✅ ADDED
        userstatus: item.userstatus || 'Active',
        designation: item.designation || '',
        detail: item.detail || '',
        avatar: item.avatar || 'avatars/300-6.jpg',
        cmpmid: item.cmpmid,
        initials: item.initials || { label: '', state: 'primary' },
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    } catch (error) {
      console.error('Error creating user:', error);

      if (axios.isAxiosError(error)) {
        // Log the full error response to see validation details
        console.log('Full error response:', error.response);
        console.log('Error data:', error.response?.data);
        console.log('Error status:', error.response?.status);
        console.log('Error headers:', error.response?.headers);

        if (error.response) {
          // Handle 422 validation errors specifically
          if (error.response.status === 422) {
            const validationErrors = error.response.data;
            console.log('Validation errors:', validationErrors);

            // Extract validation error messages
            let errorMessage = 'Validation errors';
            if (validationErrors.errors) {
              // Laravel-style validation errors
              const errorFields = Object.keys(validationErrors.errors);
              if (errorFields.length > 0) {
                errorMessage +=
                  ': ' +
                  errorFields
                    .map((field) => `${field} - ${validationErrors.errors[field].join(', ')}`)
                    .join('; ');
              }
            } else if (validationErrors.message) {
              errorMessage = validationErrors.message;
            } else {
              errorMessage = 'Please check all required fields are filled correctly';
            }

            throw new Error(errorMessage);
          }

          throw new Error(error.response.data.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
          throw new Error(
            'No response received from server. Please check your network connection.'
          );
        }
      }

      throw error;
    }
  },

  // Update user
  async updateUser(id: number, user: Omit<User, 'usermid'>): Promise<User> {
    try {
      const response = await axios.put<ApiResponse<any>>(`${EDIT_USER_URL}/${id}`, {
        username: user.username || '',
        userloginid: user.userloginid || '',
        useremail: user.useremail || '',
        usermobile: user.usermobile || '',
        userrole: user.userrole || 'User',
        usertype: user.usertype || 'User', // ✅ ADDED
        roleid: user.roleid || 0, // ✅ ADDED
        userstatus: user.userstatus || 'Active',
        designation: user.designation || '',
        detail: user.detail || '',
      });

      console.log('Update user full response:', response);
      console.log('Update user response data:', response.data);
      console.log('Update user response.data.data:', response.data.data);

      if (response.status !== 200) {
        throw new Error(response.data.message || 'API returned false result');
      }

      // Check if response.data.data exists and has the expected structure
      const item = response.data.data;

      if (!item) {
        console.warn(
          'No data returned from update API. The update was successful but no user data was returned.'
        );
        console.log('Creating user object from input data with ID:', id);

        // Return a user object constructed from the input data
        return {
          usermid: id,
          username: user.username || '',
          userloginid: user.userloginid || '',
          userpassword: user.userpassword || '',
          useremail: user.useremail || '',
          usermobile: user.usermobile || '',
          userrole: user.userrole || 'User',
          usertype: user.usertype || 'User', // ✅ ADDED
          roleid: user.roleid || 0, // ✅ ADDED
          userstatus: user.userstatus || 'Active',
          designation: user.designation || '',
          detail: user.detail || '',
          avatar: user.avatar || 'avatars/300-6.jpg',
          cmpmid: user.cmpmid,
          initials: user.initials || { label: '', state: 'primary' },
          created_at: user.created_at,
          updated_at: new Date().toISOString(),
        };
      }

      // If we have item data, use it with fallbacks
      return {
        usermid: item.usermid || id,
        username: item.username || user.username || '',
        userloginid: item.userloginid || user.userloginid || '',
        userpassword: item.userpassword || user.userpassword || '',
        useremail: item.useremail || user.useremail || '',
        usermobile: item.usermobile || user.usermobile || '',
        userrole: item.userrole || user.userrole || 'tellecaller',
        usertype: item.usertype || user.usertype || 'User', // ✅ ADDED
        roleid: item.roleid || user.roleid || 0, // ✅ ADDED
        userstatus: item.userstatus || user.userstatus || 'Active',
        designation: item.designation || user.designation || '',
        detail: item.detail || user.detail || '',
        avatar: item.avatar || user.avatar || 'avatars/300-6.jpg',
        cmpmid: item.cmpmid || user.cmpmid,
        initials: item.initials || user.initials || { label: '', state: 'primary' },
        created_at: item.created_at || user.created_at,
        updated_at: item.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error updating user:', error);

      // Provide more specific error messages
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          throw new Error(error.response.data.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error(
            'No response received from server. Please check your network connection.'
          );
        }
      }

      throw error;
    }
  },

  // Delete user
  async deleteUser(id: number): Promise<void> {
    try {
      const response = await axios.delete<ApiResponse<void>>(`${DELETE_USER_URL}/${id}`);

      if (response.status !== 200) {
        throw new Error(response.data.message || 'API returned false result');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};
