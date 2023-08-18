## 要求

要使用Nunu，您需要在系统上安装以下软件：

* Golang 1.16或更高版本
* Git

notes:


## 安装

### 安装nunu

您可以使用以下命令安装Nunu：

```bash
go install github.com/go-nunu/nunu@latest
```

### 配置环境变量

notes:

```text
将${GOPATH}/bin 加入环境变量,即可在终端使用nunu命令
```

### 创建新项目

您可以使用以下命令创建一个新的Golang项目：

```bash
nunu new projectName
```

默认拉取github源，你也可以使用国内加速仓库

```
// 使用基础模板
nunu new projectName -r https://gitee.com/go-nunu/nunu-layout-basic.git
// 使用高级模板
nunu new projectName -r https://gitee.com/go-nunu/nunu-layout-advanced.git
```

此命令将创建一个名为`projectName`的目录，并在其中生成一个优雅的Golang项目结构。

## 目录结构

```
.
├── cmd
│   └── server
│       ├── main.go
│       ├── wire.go             这个文件就是注入文件，添加handler、service、dao都需要修改这个文件，然后执行 nunu wire 生成wire_gen.go文件
│       └── wire_gen.go
├── config
│   ├── local.yml                配置文件
│   └── prod.yml
├── internal                     类似于 cn.cas.xjipc.blockchain
│   ├── handler                  类似于 cn.cas.xjipc.blockchain.controller
│   │   ├── handler.go
│   │   └── user.go
│   ├── middleware 
│   │   └── cors.go
│   ├── model                    类似于 cn.cas.xjipc.blockchain.entity
│   │   └── user.go
│   ├── repository               类似于 cn.cas.xjipc.blockchain.entity
│   │   ├── repository.go
│   │   └── user.go
│   ├── server                   
│   │   └── http.go
│   └── service                  类似于 cn.cas.xjipc.blockchain.service
│       ├── service.go
│       └── user.go
├── pkg                          公共组件包,log配置、配置文件读取等都放这里
├── LICENSE
├── README.md
├── README_zh.md
├── go.mod
└── go.sum

```

### 创建组件

您可以使用以下命令为项目创建handler、service和dao等组件：

```bash
nunu create handler user
nunu create service user
nunu create repository user
nunu create model user
```

或

```
nunu create all user
```

这些命令将分别创建一个名为`UserHandler`、`UserService`、`UserDao`和`UserModel`的组件，并将它们放置在正确的目录中。

notes:

```text
nunu create all user 会创建controller、service、dao、entity并放置到对应文件夹下
```

### 启动项目

您可以使用以下命令快速启动项目：

```bash
nunu run
```

此命令将启动您的Golang项目，并支持文件更新热重启。

### 编译wire.go

您可以使用以下命令快速编译`wire.go`：

```bash
nunu wire
```

此命令将编译您的`wire.go`文件，并生成所需的依赖项。

## 自己编写部分

1. internal中handler、service、repository、model

可参考各包中user.go文件编写自己的代码

handler

```go
package handler

// 定义各种接口
type UserHandler interface {
	Register(ctx *gin.Context)
	Login(ctx *gin.Context)
	GetProfile(ctx *gin.Context)
	UpdateProfile(ctx *gin.Context)
}

// 类似于 注入service
type userHandler struct {
	*Handler
	userService service.UserService
}

func NewUserHandler(handler *Handler, userService service.UserService) UserHandler {
	return &userHandler{
		Handler:     handler,
		userService: userService,
	}
}

// 各个接口逻辑实现
func (h *userHandler) Register(ctx *gin.Context) {
	req := new(service.RegisterRequest)
	if err := ctx.ShouldBindJSON(req); err != nil {
		resp.HandleError(ctx, http.StatusBadRequest, 1, errors.Wrap(err, "invalid request").Error(), nil)
		return
	}
	if err := h.userService.Register(ctx, req); err != nil {
		resp.HandleError(ctx, http.StatusBadRequest, 1, errors.Wrap(err, "invalid request").Error(), nil)
		return
	}
	resp.HandleSuccess(ctx, nil)
}
func (h *userHandler) Login(ctx *gin.Context) {
}
func (h *userHandler) GetProfile(ctx *gin.Context) {
	resp.HandleSuccess(ctx, user)
}
func (h *userHandler) UpdateProfile(ctx *gin.Context) {
	resp.HandleSuccess(ctx, nil)
}
```

service

```go
package service

// gorm 结构
type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}

// gorm 结构
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// gorm 结构
type UpdateProfileRequest struct {
	Nickname string `json:"nickname"`
	Email    string `json:"email" binding:"required,email"`
	Avatar   string `json:"avatar"`
}

// gorm 结构
type ChangePasswordRequest struct {
	OldPassword string `json:"oldPassword" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required"`
}

// 定义service 方法
type UserService interface {
	Register(ctx context.Context, req *RegisterRequest) error
	Login(ctx context.Context, req *LoginRequest) (string, error)
	GetProfile(ctx context.Context, userId string) (*model.User, error)
	UpdateProfile(ctx context.Context, userId string, req *UpdateProfileRequest) error
}

// 类似于 注入dao 
type userService struct {
	// userDao
	userRepo repository.UserRepository
	*Service
}

func NewUserService(service *Service, userRepo repository.UserRepository) UserService {
	return &userService{
		userRepo: userRepo,
		Service:  service,
	}
}

// 每个service方法的具体实现
func (s *userService) Register(ctx context.Context, req *RegisterRequest) error {
	// 具体实现逻辑
	return nil
}
func (s *userService) Login(ctx context.Context, req *LoginRequest) (string, error) {
	return "", nil
}
func (s *userService) GetProfile(ctx context.Context, userId string) (*model.User, error) {
	return nil, nil
}
func (s *userService) UpdateProfile(ctx context.Context, userId string, req *UpdateProfileRequest) error {
	return nil
}
```

repository

```go
package repository

// 定义dao各种方法
type UserRepository interface {
	Create(ctx context.Context, user *model.User) error
	Update(ctx context.Context, user *model.User) error
	GetByID(ctx context.Context, id string) (*model.User, error)
	GetByUsername(ctx context.Context, username string) (*model.User, error)
}
type userRepository struct {
	*Repository
}

func NewUserRepository(r *Repository) UserRepository {
	return &userRepository{
		Repository: r,
	}
}
func (r *userRepository) Create(ctx context.Context, user *model.User) error {
	if err := r.db.Create(user).Error; err != nil {
		return errors.Wrap(err, "failed to create user")
	}
	return nil
}
func (r *userRepository) Update(ctx context.Context, user *model.User) error {
	return nil
}
func (r *userRepository) GetByID(ctx context.Context, userId string) (*model.User, error) {
	return nil, nil
}
func (r *userRepository) GetByUsername(ctx context.Context, username string) (*model.User, error) {
	return nil, nil
}
```

notes:

```text
gorm结构在service编写时，不要让dao返回相同gorm结构，
否则会出现循环依赖，导致无法运行
dao会注入service，service又会注入dao
```

2. 修改cmd /server/wire.go文件 此步骤中添加相关controller等

```go
//go:build wireinject
// +build wireinject

package main

import (
	"github.com/gin-gonic/gin"
	"github.com/google/wire"
	"github.com/spf13/viper"
	"myweb/internal/handler"
	"myweb/internal/middleware"
	"myweb/internal/repository"
	"myweb/internal/server"
	"myweb/internal/service"
	"myweb/pkg/helper/sid"
	"myweb/pkg/log"
)

var ServerSet = wire.NewSet(server.NewServerHTTP)

var SidSet = wire.NewSet(sid.NewSid)

var JwtSet = wire.NewSet(middleware.NewJwt)

var HandlerSet = wire.NewSet(
	handler.NewHandler,
	handler.NewUserHandler,
	// 创建了handler，就要在此添加，service，repository同
	handler.NewGoodHandler,
)

var ServiceSet = wire.NewSet(
	service.NewService,
	service.NewUserService,
	//
	service.NewGoodService,
)

var RepositorySet = wire.NewSet(
	// mysql redis baas貌似不需要
	repository.NewDB,
	repository.NewRedis,
	repository.NewRepository,
	repository.NewUserRepository,
	//
	repository.NewGoodRepository,
)

func newApp(*viper.Viper, *log.Logger) (*gin.Engine, func(), error) {
	panic(wire.Build(
		ServerSet,
		RepositorySet,
		ServiceSet,
		HandlerSet,
		SidSet,
		JwtSet,
	))
}

```

notes:

```text
wire_gen.go 不能自己修改，只能使用nunu wire命令去更新生成

wire命令目前没了解如何去使用
```

3. 命令行执行 nunu wire 注入依赖

4. （可选）命令行执行 nunu run 选择 migration 数据迁移

notes:

```text
此步骤不是必须执行步骤，
执行此步骤原因：数据库中不存在相关表定义，此步骤可根据model包下实体进行表定义
```

5. 命令行执行 nunu run 选择 server 启动服务

## 容器化部署

### 打包

1. 手动打包

在项目根目录执行

```bash
                 
docker build --no-cache -t  local-test/demo-api:v1 --build-arg APP_CONF=config/local.yml --build-arg  APP_RELATIVE_PATH=./cmd/server/... -f scripts/build/Dockerfile  .
```

2. make docker方式打包

在项目根目录执行

```bash
make docker
```

### 编写容器编排文件

```yaml
version: '3'

networks:
  basic:
    external: true
services:
  goweb:
    container_name: test
    image: nunu-test/demo-api:v1
    environment:
      - APP_CONF=config/local.yml
    volumes:
      - ./config/local.yml:/data/app/config/local.yml
    ports:
      - 8080:8000
    networks:
      - basic
```