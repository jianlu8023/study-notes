CUR_DIR:=$(notdir $(shell dirname $(abspath $(MAKEFILE_LIST))))
CDIR:=$(dir $(abspath $(MAKEFILE_LIST)))
CDIRNAME:=$(shell dirname $(CDIR))

DOCKER_FILE:= $(lastword $(CUR_DIR))/Dockerfile
CUR_TIME:= $(shell date +"%Y%m%d%H%M")
IMAGE_VERSION:=v$(CUR_TIME)
IMAGE_NAME:=prefix/ubuntu/demo/app-server:$(IMAGE_VERSION)

build:
	@echo "Current Dir: $(CUR_DIR)"
	@echo "Dockerfile : $(DOCKER_FILE)"
	@echo "Current Time: $(CUR_TIME)"
	@echo "Image Version: $(IMAGE_VERSION)"
	@echo "Image Name: $(IMAGE_NAME)"
	@cd "$(CDIRNAME)" && docker buildx build -t "$(IMAGE_NAME)" --no-cache -f "$(DOCKER_FILE)" .
	@echo "done"
