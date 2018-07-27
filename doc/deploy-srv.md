> #### 服务端部署指南
- 环境服务

  ```
  node >= 8.9.0
  mongodb
  redis
  ```
- 步骤

  - git clone https://github.com/lazy-koala/imgs-upload-srv.git
  
  - node-srv/config 新建以下相关配置
    - basic.json  基本配置
      ```
        "imgsDomain": "" // 图片可访问的域名配置
      ```
      ```json
      {
        "port": 8005,
        "imgsDomain": ""
      ```
    - mongo.json mongodb数据库配置
      ```json
      {
        "host": "",
        "port": 6330,
        "username": "",
        "password": "",
        "dbname": ""
      }
      ```
    - redis.json redis缓存配置
      ```json
      {
        "host": "",
        "port": 6379,
        "password": "",
        "no_ready_check": true
      }
      ```
    - upload.json 图片上传配置
      ```
      path: 图片上传的物理服务器路径 (文件夹)
      ```
      ```json
      {
        "path": ""
      }
      ```
      
  - 切换至 node-srv 目录执行 npm install 安装服务端依赖的相关组件
  
  - node app.js 启动后端服务 (推荐使用nohup或采用pm2管理)
