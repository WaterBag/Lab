helm upgrade --install jupyterhub jupyterhub/jupyterhub -n lab --values values-3.3.8.yaml --cleanup-on-fail --version 3.3.8

helm upgrade --install jupyterhub jupyterhub/jupyterhub -n lab --values values-4.6.2.yaml --cleanup-on-fail --version 4.6.2
