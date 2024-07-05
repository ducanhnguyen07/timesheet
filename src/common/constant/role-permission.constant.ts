import { RoleConstant } from './role.constant';

const RolePermission = {
  [RoleConstant.USER]: [
    // timesheet
    'timesheet_create',
    'timesheet_read',
    'timesheet_delete',

    // request
    'request_create',
    'request_read',
    'request_delete',
  ],

  [RoleConstant.MANAGER]: [
    // user
    'user_create',
    'user_read',
    'user_update',
    'user_delete',

    // project
    'project_create',
    'project_read',
    'project_update',
    'project_delete',

    // task
    'task_create',
    'task_read',
    'task_update',
    'task_delete',

    // timesheet
    'timesheet_create',
    'timesheet_read',
    'timesheet_update',
    'timesheet_delete',

    // request
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

    // project
    'project_create',
    'project_read',
    'project_update',
    'project_delete',

    // task
    'task_create',
    'task_read',
    'task_update',
    'task_delete',

    // timesheet
    'timesheet_create',
    'timesheet_read',
    'timesheet_update',
    'timesheet_delete',

    // request
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
