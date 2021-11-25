/*
 * @Author: Seth
 * @Email: seth.qiang@gmail.com
 * @Date: 2021-09-25 10:15:04
 * @Description:
 */
import Vue from 'vue'
import {
  Form, FormItem, Input, Button, Message,
  Container, Header, Aside, Main, Menu,
  MenuItem, Submenu, MenuItemGroup, Collapse,
  Breadcrumb, BreadcrumbItem, Card, Row, Table,
  TableColumn, Col, Dialog, Pagination,
  Switch, MessageBox, Dropdown, DropdownItem,
  DropdownMenu, Tree, Tooltip, Select, Option,
  Upload
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Message)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Collapse)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Table)
Vue.use(Col)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Tree)
Vue.use(Tooltip)
Vue.use(Select)
Vue.use(Option)
Vue.use(Upload)

// notice_messgae
Vue.prototype.$message = Message
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$prompt = MessageBox.prompt;