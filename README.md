![license](https://img.shields.io/badge/license-GNU-100000.svg)
![vue](https://img.shields.io/badge/>-vue-lightred.svg)
![node](https://img.shields.io/badge/>-nodejs-green.svg)
![vue](https://img.shields.io/badge/>-koa2-blue.svg)

> #### 图床服务

- Why

    ```
    1. 一款以管理图片为主导的图床
    2. 为自己的图片分类，贴标签以便后面找到它们
    3. 要建立几张图片集用于分享
    4. 想要为图片提供在线外链
    5. 想要安安静静存储个人图片(其他人不能访问)
    ...
    ```

- #### 在线使用 [https://imgs.acexy.cn](https://imgs.acexy.cn)

    - 原图床地址 https://imgs.thankjava.com 更改为 https://imgs.acexy.cn
    
    - 原图外链主域名 https://source.thankjava.com 更改为 https://source.acexy.cn
    
        ```
        当前两个外链主域名均可使用，预计10月底进行完整切换
        
        域名更换不影响用户任何数据。
        ```

    - 使用前言
    
        ```
        免费的，简洁的图床服务，即开即用，开源免费，基于GNU通用公共许可证v3.0提供在线图片解决方案。

            本站为非盈利性服务，意在为你提供在线存储解决方案。

            请勿上传任何违反国家法律的图片！

            互联网为开放网络，如果你泄漏你的在线图片地址，其他任何人均能访问，这也是图床的基本概念。

            为了你的个人隐私安全，请勿上传敏感信息。

            如果你有任何的建议或反馈，可邮件至 team@thankjava.com

            科技向善，互利互助。

        大陆用户访问可能有较大延迟。
        ```

- #### CHANGELOG **为支持正常运行(防攻击)部分核心代码未开源**

    - 1.0.7 bugfix
    
        - 调整了对图片进行分级时，若无法正确分级时的相关数据记录问题

    - 1.0.7 viewer **(BETA)** [问题反馈](https://github.com/lazy-koala/imgs-upload-srv/issues/new)
        
        - 图片浏览支持webp格式
        - 当前返回webp格式的设备
        
          系统 | 浏览器 | 其他
          --- | --- | ---
          \* | \* | 浏览器主动表示支持 webp
        
    - 1.0.7

        - UI小姐姐更新了一波前端展示效果
        - 缩略图展示正式上线，加速个人中心图片展示
        - 图片分级判断上线(不限制；限制未成年；成人图片)，后续将按照相关分级限制违规图片
        - 修复一个内部图床访问原图加载失败的问题，取消内部webp处理
    
    - [历史记录](https://github.com/lazy-koala/imgs-upload-srv/blob/master/doc/changelog.md)
---
> #### 技术栈
- Server:

    - Node
    - Koa2
            
- WEB:

    - HTML5
    - Vue
            
- DataBase:

    - MongoDB
    - Redis
- 自建部署指南

    - [前端部署指南](https://github.com/lazy-koala/imgs-upload-srv/blob/master/doc/deploy-web.md)

    - [后端部署指南](https://github.com/lazy-koala/imgs-upload-srv/blob/master/doc/deploy-srv.md)
---    
> #### 关于我们

[![org](https://img.shields.io/badge/org-@LazyKoala-yellow.svg)](https://github.com/lazy-koala/)

[![author](https://img.shields.io/badge/author-@qazyuan-blue.svg)](https://github.com/qazyuan/) [![author](https://img.shields.io/badge/author-@acexy-blue.svg)](https://github.com/acexy/)

> #### Thanks [Jetbrains Ides](https://www.jetbrains.com/?from=imgs-upload-srv)
<img src="https://source.acexy.cn/view/XPgu+qW" width = "80" height = "80" alt="jetbrains logo" />
