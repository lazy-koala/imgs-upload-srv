> #### 服务端部署指南
- 环境服务

  ```
  node >= 8.9.0
  mongodb
  redis
  ```
- 步骤

  - git clone https://github.com/lazy-koala/imgs-upload-srv.git
  
  - 调整 node-srv/config 下相关配置
    - basic.json  基本配置
      imgsDomain：上传的图片可访问的域名
    - mongo.json mongodb数据库配置
    - redis.json redis缓存配置
    - upload.json 图片上传配置
      path: 图片上传的物理服务器路径 (文件夹)
      
  - 切换至 node-srv 目录执行 npm install 安装服务端依赖的相关组件
  
  - node app.js 启动后端服务 (使用nohup或采用pm2管理)
