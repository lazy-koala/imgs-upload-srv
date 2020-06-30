import Vue from 'vue'
import {
  Button,
  message,
  Popconfirm,
  Modal,
  Icon,
  Menu


} from 'ant-design-vue';



Vue.use(message);
Vue.use(Popconfirm);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Menu);

Vue.prototype.$message = message;
Vue.prototype.$confirm = Modal.confirm;