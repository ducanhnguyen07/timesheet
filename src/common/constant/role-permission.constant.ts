import { RoleConstant } from './role.constant';

const RolePermission = {
  [RoleConstant.USER]: [
    // user
    "user_read_own_timesheet",

    // timesheet
    'timesheet_create',
    'timesheet_delete',

    // task
    'task_read_own',

    // request
    'own_request_read',
    'request_create',
    'request_delete',
  ],

  [RoleConstant.MANAGER]: [
    // user
    'user_create',
    'user_read',
    'user_update',
    'user_delete',
    "user_read_own_timesheet",

    // project
    'project_create',
    'project_read',
    'project_update',
    'project_delete',

    // task
    'task_read_own',
    'task_create',
    'task_read',
    'task_update',
    'task_delete',

    // timesheet
    'timesheet_create',
    'timesheet_read',
    'timesheet_update',
    'timesheet_delete',
    'timesheet_approve',

    // request
    'own_request_read',
    'request_create',
    'request_read',
    'request_update',
    'request_delete',
  ],

  [RoleConstant.ADMIN]: [
    // user
    'user_create',
    'user_read',
    'user_update',
    'user_delete',
    "user_read_own_timesheet",

    // project
    'project_create',
    'project_read',
    'project_update',
    'project_delete',

    // task
    'task_read_own',
    'task_create',
    'task_read',
    'task_update',
    'task_delete',

    // timesheet
    'timesheet_create',
    'timesheet_read',
    'timesheet_update',
    'timesheet_delete',
    'timesheet_approve',

    // request
    'own_request_read',
    'request_create',
    'request_read',
    'request_update',
    'request_delete',

    // role
    'role_create',
    'role_read',
    'role_update',
    'role_delete',

    // permisson
    'permisson_create',
    'permisson_read',
    'permisson_update',
    'permisson_delete',
  ],
};

export default RolePermission;
