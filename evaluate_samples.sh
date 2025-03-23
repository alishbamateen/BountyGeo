#!/bin/bash

LIST=$( find -L ./data/sample_images/ -iname *.jpg )
# LIST=$( find -L ./dataset/ground_level/CAL/major/ -iname *.jpg )

for img in $LIST; do

    sbatch evaluate.sbatch ${img}

done