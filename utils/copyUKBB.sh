#!/bin/sh

echo "Upload Alkesgroup UKBB data from GCS to Analysis Tools S3"
ssh -o StrictHostKeyChecking=no helix "module load python; pip install gsutil --user; ~/.local/bin/gsutil -m rsync gs://broad-alkesgroup-public/UKBB_LD/ s3://bucket/ezQTL/UKBB_LD/;"
echo "Done"