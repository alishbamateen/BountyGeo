#!/bin/bash

#SBATCH --job-name=RUN_SBATCH
#SBATCH --qos=m5
#SBATCH --nodes=1
#SBATCH --gpus-per-task=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=5
#SBATCH --mem=24gb
#SBATCH --time=0:10:00
#SBATCH --wait-all-nodes=1
#SBATCH --exclude=gpu138

bash -c "python3.12 -u /h/arturp/Development.d/GitHub.d/BountyGeo/model/evaluate.py \
    --pr 5 \
    --img_path $1 \
    --ckp_path /h/arturp/Development.d/GitHub.d/BountyGeo/data/best_checkpoint/best_checkpoint_40.pt"

# bash -c "python3.12 -u /h/arturp/Development.d/GitHub.d/BountyGeo/model/evaluate.py \
#     --pr 25 \
#     --img_path $1 \
#     --ckp_path /h/arturp/Development.d/GitHub.d/BountyGeo/data/best_checkpoint/lr05_wd0001_pr25_checkpoint_20.pt"
