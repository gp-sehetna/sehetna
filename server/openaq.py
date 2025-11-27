import boto3
import os
import gzip
import shutil
from tqdm import tqdm
from botocore.client import Config
from botocore import UNSIGNED

# ---------------- Configuration ----------------
location_id = 971
BUCKET = "openaq-data-archive"

# FIX: Added a trailing slash '/' at the end. 
# This ensures we get 'locationid=971/' and NOT 'locationid=9712/'
PREFIX = f"records/csv.gz/locationid={location_id}/"
OUTPUT_FILE = f"./openaq_merged-{location_id}.csv"

s3 = boto3.client(
    "s3",
    region_name="us-east-1",
    config=Config(signature_version=UNSIGNED)
)

# ---------------- Functions ----------------
def list_all_objects(bucket, prefix):
    """Yield all object keys under a given S3 prefix."""
    paginator = s3.get_paginator("list_objects_v2")
    pages = paginator.paginate(Bucket=bucket, Prefix=prefix)
    
    for page in pages:
        for obj in page.get("Contents", []):
            yield obj["Key"]

def merge_files_into_one(bucket, keys, output_file):
    """
    Stream each gzipped file from S3 and merge into a single CSV.
    OPTIMIZATION: Removes header rows from all files except the first one.
    """
    print(f"Merging {len(keys)} files into {output_file} ...")
    
    with open(output_file, "wb") as outfile:
        for i, key in enumerate(tqdm(keys, desc="Processing files")):
            obj = s3.get_object(Bucket=bucket, Key=key)
            
            # Use gzip to decompress on the fly
            with gzip.GzipFile(fileobj=obj['Body']) as gz:
                # Read the first line (header)
                header = gz.readline()
                
                # If it's the very first file, write the header
                if i == 0:
                    outfile.write(header)
                
                # For all files (including first), write the rest of the content.
                # shutil.copyfileobj writes from current position, so header is skipped 
                # for files > 0 because we already read it with readline() above.
                shutil.copyfileobj(gz, outfile)

    print(f"Done! Clean merged CSV saved at: {output_file}")

# ---------------- Main ----------------
def main():
    print(f"Listing objects for Location ID: {location_id}...")
    
    # Generate list of files
    keys = list(list_all_objects(BUCKET, PREFIX))
    print(f"Found {len(keys)} files.")

    if keys:
        merge_files_into_one(BUCKET, keys, OUTPUT_FILE)
    else:
        print(f"No files found for location {location_id}. Check if the ID is correct.")

if __name__ == "__main__":
    main()