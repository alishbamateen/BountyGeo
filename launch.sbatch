#!/bin/bash

#SBATCH --job-name=RUN_SBATCH
#SBATCH --qos=m4
#SBATCH --nodes=1
#SBATCH --gpus-per-task=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=10
#SBATCH --mem=64gb
#SBATCH --time=2:00:00
#SBATCH --wait-all-nodes=1
#SBATCH --signal=B:USR1@120
#SBATCH --exclude=gpu138
#SBATCH --partition=a40,rtx6000

python3.12 -u model/train.py --lr $1 --wd $2 --pr $3 \
--data_csv_root /checkpoint/arturp/15450683/data/ground_level/ \
--backbone /h/arturp/Development.d/GitHub.d/Project_Elder_Experimental/data/input/imagenet21k_ViT-B_16.npz
