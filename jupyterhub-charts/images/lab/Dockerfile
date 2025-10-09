FROM quay.io/jupyter/datascience-notebook:latest

RUN pip install --no-cache-dir jupyterlab-language-pack-zh-CN
RUN pip install -U cos-python-sdk-v5

COPY images/lab/overrides.json ${CONDA_DIR}/share/jupyter/lab/settings/overrides.json
COPY SimHei.ttf ${CONDA_DIR}/lib/python3.12/site-packages/matplotlib/mpl-data/fonts/ttf/
ARG CPW_VERSION

COPY jupyterlab_cpw-${CPW_VERSION}-py3-none-any.whl .
RUN ls
RUN pip install jupyterlab_cpw-${CPW_VERSION}-py3-none-any.whl
RUN rm -rf jupyterlab_cpw-${CPW_VERSION}-py3-none-any.whl

RUN pip install jupyterlab-lsp
RUN pip install -U jedi-language-server
