#!/bin/bash

for lr in 0.05; do
    for wd in 0.001; do
        for pt in 1 5 10 25 50 100 150; do
            sbatch --output "./data/training/${lr}_${wd}_${pt}/logs.out" --error "./data/training/${lr}_${wd}_${pt}/logs.err" \
                launch.sbatch ${lr} ${wd} ${pt} 
        done
    done
done