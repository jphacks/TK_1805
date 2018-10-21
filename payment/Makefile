HELM_RELEASE_NAME=payment
PROJECT_ID=jphack2018-219415
CONTAINER_BUILDER=docker
ClOUD_PROVIDER=gcloud
HELM=helm
VERSION=latest
APIB_HTML_CONVERTER=aglio
APIB_FILENAME=api

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
	$(CONTAINER_BUILDER) build -t asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME):$(VERSION) .

.PHONY: build.deploy
build.deploy:
	$(CONTAINER_BUILDER) build -t asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME):$(VERSION) .
	$(ClOUD_PROVIDER) docker -- push asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME):$(VERSION)

.PHONY: build.doc
build.doc:
	$(APIB_HTML_CONVERTER) -i doc/v1/$(APIB_FILENAME).apib -o doc/v1/$(APIB_FILENAME).html
	$(CONTAINER_BUILDER) build -t asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME)-apib:$(VERSION) -f doc/Dockerfile .

.PHONY: build.doc.deploy
build.doc.deploy:
	$(APIB_HTML_CONVERTER) -i doc/v1/api.apib -o doc/v1/api.html
	$(CONTAINER_BUILDER) build -t asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME)-apib:$(VERSION) -f doc/Dockerfile .
	$(ClOUD_PROVIDER) docker -- push asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME)-apib:$(VERSION)