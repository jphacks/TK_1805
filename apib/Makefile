HELM_RELEASE_NAME=payment
PROJECT_ID=jphack2018-219415
CONTAINER_BUILDER=docker
ClOUD_PROVIDER=gcloud
VERSION=latest
APIB_HTML_CONVERTER=aglio
SUBDIRS=frontend payment store

.PHONY: build
build:
	@for subdir in $(SUBDIRS); do\
		$(APIB_HTML_CONVERTER) -i $$subdir/v1/api.apib -o $$subdir/v1/api.html;\
	done

.PHONY:deploy
deploy:
	make build
	$(ClOUD_PROVIDER) docker -- push asia.gcr.io/$(PROJECT_ID)/apib:$(VERSION)