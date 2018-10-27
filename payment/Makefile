HELM_RELEASE_NAME=payment
PROJECT_ID=jphack2018-219415
CONTAINER_BUILDER=docker
ClOUD_PROVIDER=gcloud
HELM=helm

.PHONY: upgrade
upgrade:
	$(HELM) upgrade $(HELM_RELEASE_NAME) ./k8s/payment

.PHONY: deploy
deploy:
	$(HELM) install --name=$(HELM_RELEASE_NAME) ./k8s/payment

.PHONY: delete
delete:
	$(HELM) delete --purge $(HELM_RELEASE_NAME)

.PHONY: build
build:
	$(CONTAINER_BUILDER) build -t asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME):latest .

.PHONY: build.deploy
build.deploy:
	$(CONTAINER_BUILDER) build -t asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME):latest .
	$(ClOUD_PROVIDER) docker -- push asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME):latest

.PHONY: build.doc
build.doc:
	$(CONTAINER_BUILDER) build -t asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME)-apib:latest -f doc/Dockerfile .

.PHONY: build.doc.deploy
build.dob:
	$(CONTAINER_BUILDER) build -t asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME)-apib:latest -f doc/Dockerfile .
	$(ClOUD_PROVIDER) docker -- push asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME)-apib:latest