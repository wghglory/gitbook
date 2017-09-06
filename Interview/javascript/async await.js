import React, { Component } from 'react';
import { Table, Pagination, Popconfirm, Button } from 'antd';
import moment from 'moment';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/user';
import { getOrganizationsBatch } from '../../services/organization';
import UserEditModal from './UserEditModal';
import UserCreateModal from './UserCreateModal';
import './UserList.scss';

export default class UserList extends Component {
  constructor(props) {
    super(props);

    this.fetchUsers = this.fetchUsers.bind(this);
    this.fetchOrganizations = this.fetchOrganizations.bind(this);
    this.pageChangeHandler = this.pageChangeHandler.bind(this);
    this.createHandler = this.createHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);

    this.state = {
      loading: true,
      users: [],
      last: false, //last page
      totalPages: 0,
      totalElements: 0,
      first: true, //first page
      numberOfElements: 0,
      sort: null,
      pageSize: 0,
      pageIndex: 0
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  // webpack! entry: ['babel-polyfill', './src/index.js'],
  async fetchUsers(pageIndex, pageSize) {
    let res = await getUsers(pageIndex, pageSize);
    let formattedUsers = await this.fetchOrganizations(res.content);

    this.setState({
      loading: false,
      users: formattedUsers, // added organization name
      last: res.last,
      totalPages: res.totalPages,
      totalElements: res.totalElements,
      first: res.first,
      numberOfElements: res.numberOfElements,
      sort: res.sort,
      pageSize: res.size,
      pageIndex: res.number + 1 // 后台number从0开始，pageIndex从1，展示pagination
    });
  }

  /*  // Promise 写法
    // method 1: 2个 then 嵌套
    fetchUsers(pageIndex, pageSize) {
        getUsers(pageIndex, pageSize).then(res => {
            this.fetchOrganizations(res.content).then((formattedUsers) => this.setState({
                loading: false, 
                users: formattedUsers, // added organization name
                last: res.last,
                totalPages: res.totalPages,
                totalElements: res.totalElements,
                first: res.first,
                numberOfElements: res.numberOfElements,
                sort: res.sort,
                pageSize: res.size,
                pageIndex: res.number + 1 // 后台number从0开始，pageIndex从1，展示pagination
            }))
        })
    } 
    
    // method 2: 没有 then 的嵌套，但如果不用 Promise.all, 第二个 then 如何获取到第一个 then 的变量？
    fetchUsers(pageIndex, pageSize) {
        getUsers(pageIndex, pageSize).then(res => {
            this.setState({
                loading: false, 
                last: res.last,
                totalPages: res.totalPages,
                totalElements: res.totalElements,
                first: res.first,
                numberOfElements: res.numberOfElements,
                sort: res.sort,
                pageSize: res.size,
                pageIndex: res.number + 1 // 后台number从0开始，pageIndex从1，展示pagination
            })
            return this.fetchOrganizations(res.content)
        }).then(formattedUsers => this.setState({
            users: formattedUsers, // added organization name
        }))
    }
    */

  fetchOrganizations(users) {
    let organizationIds = new Set();
    users.forEach((u) => organizationIds.add(u.organizationId));

    let orgMap = new Map(); //key: organizationId, value: organizationName

    return getOrganizationsBatch(Array.from(organizationIds)).then((res) => {
      const organizations = res.content;
      organizations.forEach((o) => orgMap.set(o.id, o.name));
      users.forEach((u) => (u.organizationName = orgMap.get(u.organizationId)));
      return users;
    });
  }

  pageChangeHandler(pageIndex) {
    // 发给后台的页码从0开始
    this.fetchUsers(pageIndex - 1, this.state.pageSize);
  }

  editHandler(id, model) {
    updateUser(id, model);
  }

  deleteHandler(id) {
    deleteUser(id);
  }

  createHandler(model) {
    createUser(model);
  }

  render() {
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        width: 200
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        render: (text) => <a href="#">{text}</a>
      },
      {
        title: '邮件',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '真实姓名',
        dataIndex: 'trueName',
        key: 'trueName'
      },
      {
        title: '注册时间',
        dataIndex: 'createdOn',
        key: 'createdOn',
        render: (text) => moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '禁用',
        dataIndex: 'enable',
        key: 'enable',
        render: (text) => (text ? '正常' : '禁用')
      },
      {
        title: '组织Id',
        dataIndex: 'organizationId',
        key: 'organizationId'
      },
      {
        title: '组织',
        dataIndex: 'organizationName',
        key: 'organizationName'
      },
      {
        title: '权限',
        dataIndex: 'permissions',
        key: 'permissions',
        render: (arr) => arr.join(', ')
      },
      {
        title: '备注',
        dataIndex: 'comment',
        key: 'comment'
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span className="operation">
            <UserEditModal record={record} onOk={this.editHandler.bind(null, record.id)}>
              <a>编辑</a>
            </UserEditModal>
            <Popconfirm title="Confirm to delete?" onConfirm={this.deleteHandler.bind(null, record.id)}>
              <a href="">删除</a>
            </Popconfirm>
          </span>
        )
      }
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, `selectedRows: ${selectedRows}`)
      }
    };

    const dataSet = this.state.users != null ? this.state.users : [];

    return (
      <div>
        <div className="create">
          <UserCreateModal record={{}} onOk={this.createHandler}>
            <Button type="primary">创建用户</Button>
          </UserCreateModal>
        </div>
        <Table
          rowSelection={rowSelection}
          loading={this.state.loading}
          columns={columns}
          dataSource={dataSet}
          rowKey={(record) => record.id}
          size="middle"
          bordered
          pagination={false}
        />
        <Pagination
          className="center"
          showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} 条`}
          showQuickJumper
          current={this.state.pageIndex}
          onChange={this.pageChangeHandler}
          total={this.state.totalElements}
          pageSize={this.state.pageSize}
        />
      </div>
    );
  }
}
