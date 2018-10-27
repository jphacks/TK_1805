PROJECT_ID=jphack2018-219415
CLUSTER_NAME=jphack2018-cluster
DOCKER=docker
APP=store
CLOUDCLI=gcloud

private_key.json:
	$(CLOUDCLI) config set project $(PROJECT_ID)
	$(CLOUDCLI) config set container/cluster $(CLUSTER_NAME)
	$(CLOUDCLI) iam service-accounts create $$USER --display-name $$USER 
	$(CLOUDCLI) projects add-iam-policy-binding $(PROJECT_ID) \
    	--member serviceAccount:$$(gcloud iam service-accounts list --filter=$$USER --format="value(email)") --role roles/cloudsql.client
	$(CLOUDCLI) iam service-accounts keys create \
    	./.gcp/private_key.json \
    	--iam-account=$$(gcloud iam service-accounts list --filter=$$USER --format="value(email)")

.PHONY: deploy
deploy:
	$(DOCKER) -t asia.gcr.io/$(PROJECT_ID)/$(APP):latest .
	$(CLOUDCLI) docker -- push asia.gcr.io
	gcloud docker -- push asia.gcr.io/$(PROJECT_ID)/$(APP):latest 