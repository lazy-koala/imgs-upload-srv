![license](https://img.shields.io/badge/license-GNU-100000.svg)
![vue](https://img.shields.io/badge/>-vue-lightred.svg)
![node](https://img.shields.io/badge/>-nodejs-green.svg)
![vue](https://img.shields.io/badge/>-koa2-blue.svg)

> #### 图床服务

- Why

    ```
    1. 使用markdown时，需要引入在线的图片
    2. 发送邮件或者相关网页时需要引入在线图片
    3. 需要截图保存相关图片，并在日后随时查看下载
    ...
    ```

- #### 在线使用 [https://imgs.thankjava.com](https://imgs.thankjava.com)

    ```
    免费的，简洁的图床服务，即开即用，开源免费，基于GNU通用公共许可证v3.0提供在线图片解决方案。
    ```

- #### CHANGELOG

    - 1.0.2
    
        - 升级了包含安全漏洞的模块
        - 新增图片分类功能,可以对图片分类管理,并可以给图片打上标签备注
        - 新增图片检索功能,支持分类|标签查询
        - 新增图片分类维护
        - 调整了图片短链生成策略,防止图片地址连续可猜测
        - bufix: #12
        - 调整密码找回流程，账号/邮箱轻松找回
    
    - 1.0.1-bugfix 
    
        - 图片上传问题 #8
        - 首页打包引号缺失问题修正
    
    - 1.0.1-dependencies-upgrade
    
        - 升级了包含安全漏洞的模块
    
    - 1.0.1
    
        - 新增图片加载过渡动画
        - 优化分页大小: 分页大小根据屏幕大小动态计算
        - 优化图片uri为短连接形式，调整图片的访问方式，预留更多图片访问控制处理方案
        - bufix: #5 #6
        - 在线图片服务文案变更为图床服务
        - 优化了非长期登录token的有效期: #7
        - 调整了可配置部分uri不打印出入参数, 敏感信息不予输出

    - 1.0.0-bugfix
     
        - bugfix: #1 #2 #3 #4

    - 1.0.0
    
        - 基础标准版本上线
---
> #### 技术栈
- Server:

        Node
        Koa2
            
- WEB:

        HTML5
        Vue
            
- DataBase:

        MongoDB
        Redis
---    
> #### 关于我们

[![org](https://img.shields.io/badge/org-@LazyKoala-yellow.svg)](https://github.com/lazy-koala/)

[![author](https://img.shields.io/badge/author-@qazyuan-blue.svg)](https://github.com/qazyuan/) [![author](https://img.shields.io/badge/author-@thankjava-blue.svg)](https://github.com/thankjava/)

**倾力渲染** & **强力驱动**

---
> 备注
- 在线使用 [https://imgs.thankjava.com](https://imgs.thankjava.com)
- 自建部署指南
    - [前端部署指南](https://github.com/lazy-koala/imgs-upload-srv/blob/master/doc/deploy-web.md)
    - [后端部署指南](https://github.com/lazy-koala/imgs-upload-srv/blob/master/doc/deploy-srv.md)

