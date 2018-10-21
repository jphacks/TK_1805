HELM_RELEASE_NAME=payment
PROJECT_ID=jphack2018-219415
CONTAINER_BUILDER=docker
ClOUD_PROVIDER=gcloud
VERSION=latest
APIB_HTML_CONVERTER=aglio


.PHONY: build
build:
	$(APIB_HTML_CONVERTER) -i frontend/v1/api.apib -o frontend/v1/frontend.html
	$(APIB_HTML_CONVERTER) -i store/v1/api.apib -o store/v1/payment.html
	$(APIB_HTML_CONVERTER) -i payment/v1/api.apib -o payment/v1/store.html
	$(CONTAINER_BUILDER) build -t asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME)-apib:$(VERSION) .

.PHONY:deploy
deploy:
	$(CONTAINER_BUILDER) build -t asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME)-apib:$(VERSION) .
	$(ClOUD_PROVIDER) docker -- push asia.gcr.io/$(PROJECT_ID)/$(HELM_RELEASE_NAME)-apib:$(VERSION)